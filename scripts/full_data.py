import logging
import csv
import os
import re

from snl.fetch import wiki, tomatoes, imdb

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

SEASON_COUNT = 41

SCRIPTS_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.abspath(os.path.join(SCRIPTS_DIR, os.pardir))
OUTPUT_DIR = os.path.join(BASE_DIR, "data", "full")
os.makedirs(OUTPUT_DIR, exist_ok=True)

CAST_MEMBER_FILENAME = "cast_members.csv"
CAST_MEMBER_ROWS = []

EPISODE_FILENAME = "episodes.csv"
EPISODE_ROWS = []

ROLE_FILENAME = "roles.csv"
ROLE_ROWS = []

CREDIT_FILENAME = "credits.csv"
CREDIT_ROWS = []

FAILED_FILENAME = "failed.csv"
FAILED_ROWS = []

"""
Known Deficiencies:
1.  Problem: Several actors have incomplete profiles even when data is
    gathered from both Wikipedia and Rotten Tomatoes
    Solution: Manual lookup, save as full_cast_members.csv
2.  Problem: On Wikipedia's SNL Season 6 page, Patrick Weathers does not have a
    bio page, so there is no link to it to get his name/url. Instead a citation
    is matched, which returns a text value of [6].
    Solution: Manually create data in get_cast_member_profile
3.  Problem: Season 10 Episode 16 on IMDB only lists the year it was aired, not
    the date. That episode aired on 1985-04-06
    Solution: Manually set in create_episode
4.  Problem: Some actors have different names used on different sites. The
    primary cause of this is name change from marriage. For this, the actor's
    current name will be used since most resources will refer to them using it.
    Solution: Use the name returned in the tuple by get_cast_member_profile
5.  Problem: Along with #4, some actors have additional descriptions alongside
    their name when they have a common name.
    Solution: only_name regex matches the " (...)" pattern and removes it
"""


def save_csv(header, rows, filename):
    with open("{}/{}".format(OUTPUT_DIR, filename), "w", newline="", encoding="utf-8") as fp:
        writer = csv.writer(fp)
        writer.writerow(header)
        writer.writerows(rows)


def save_cast_members():
    header = ["name", "dob", "hometown", "gender"]
    save_csv(header, CAST_MEMBER_ROWS, CAST_MEMBER_FILENAME)


def save_episodes():
    header = ["season", "episode", "air_date"]
    save_csv(header, EPISODE_ROWS, EPISODE_FILENAME)


def save_roles():
    header = ["cast_member", "season", "type"]
    save_csv(header, ROLE_ROWS, ROLE_FILENAME)


def save_credits():
    header = ["cast_member", "season", "episode"]
    save_csv(header, CREDIT_ROWS, CREDIT_FILENAME)


def save_failed():
    header = ["url"]
    save_csv(header, FAILED_ROWS, FAILED_FILENAME)


def writeable_date(date):
    if date is None:
        return
    elif isinstance(date, str):
        return date
    return date.strftime("%Y-%m-%d")


def only_name(name):
    return re.sub(r"\s+\(.+\)", "", name)


def create_episode(data):
    season = data.get("season")
    episode = data.get("episode")
    air_date = data.get("air_date")
    if season == 10 and episode == 16:
        air_date = "1985-04-06"
    EPISODE_ROWS.append((season, episode, writeable_date(air_date)))


def create_episode_credits(member_names, season, episode):
    for name in member_names:
        CREDIT_ROWS.append((name, season, episode))


def create_cast_member(data):
    name = only_name(data.get("name"))
    dob = data.get("birthdate")
    hometown = data.get("hometown")
    gender = data.get("gender")
    cast_member = (name, writeable_date(dob), hometown, gender)
    CAST_MEMBER_ROWS.append(cast_member)
    return cast_member


def create_season_roles(cast_members, season):
    """
    create a Role for every cast member in a given season
    """
    for (name, is_main) in cast_members:
        ROLE_ROWS.append((name, season, is_main))


def season_cast(season):
    """
    return a dict where the keys are cast members for a given season and the
    values are the cast type (either "main_cast" or "featured_players")
    """
    season_cast_members = {}
    full_cast = wiki.cast(season)
    for member_type in ["main_cast", "featured_players"]:
        cast_members = full_cast.get(member_type)
        for member in cast_members:
            name = member["name"]
            member["role"] = member_type
            season_cast_members[name] = member
    return season_cast_members


def complete_cast_member(data):
    keys = ["name", "birthdate", "hometown", "gender"]
    for key in keys:
        if data.get(key) is None:
            return False
    return True


def get_cast_member_profile(cast_member):
    """
    first, try to get the information from wikipedia
    then, try to get the information from rotten tomatoes
    """
    # only cast member without a wikipedia page...
    if cast_member["name"] == "[6]":
        return create_cast_member({
            "name": "Patrick Weathers",
            "birthdate": "1954-01-22",
            "hometown": "Hattieburg, Mississippia, USA",
            "gender": "male"
        })
    name = cast_member.get("name")

    data = wiki.profile(cast_member.get("profile"))
    if data is not None and complete_cast_member(data):
        logger.info("{} from wikipedia".format(name))
        return create_cast_member(data)
    # if the wikipedia data was incomplete, get data from rotten tomatoes
    # merge that if there was partial wiki information
    rt_data = tomatoes.profile_from_name(name)
    if rt_data is not None:
        if data is not None:
            data.update(rt_data)
        else:
            data = rt_data
        logger.info("{} from rotten tomatoes".format(name))
    # if we have any data, create the row
    if data is not None:
        return create_cast_member(data)
    logger.warning("{} <MISSING>".format(name))
    FAILED_ROWS.append((name,))
    return


def get_imdb_episodes(episodes, season_cast_members):
    for episode in episodes:
        # add a row to the EPISODE_ROWS list
        create_episode(episode)
        # get the cast members that appeared in the episode
        episode_cast_members = imdb.all_credited(episode.get("url"))
        if len(episode_cast_members) == 0:
            FAILED_ROWS.append((episode.get("url"),))
            continue
        logger.info("episode {}".format(episode.get("episode")))
        cast_member_names = []
        for person in episode_cast_members:
            name = only_name(person["name"])
            if name in season_cast_members:
                cast_member_names.append(name)
        create_episode_credits(
            set(cast_member_names),
            episode.get("season"),
            episode.get("episode")
        )


def run():
    known_cast = {}

    for season in range(1, SEASON_COUNT + 1):
        logger.info("Getting Season {}".format(season))
        season_cast_members = season_cast(season)

        cast_member_roles = []
        season_cast_names = {}
        for name in season_cast_members.keys():
            cast_member = season_cast_members[name]
            if name not in known_cast:
                cast_member_tuple = get_cast_member_profile(cast_member)
                # use the name returned by get_cast_member_profile
                if cast_member_tuple is not None:
                    name = cast_member_tuple[0]
                known_cast[name] = cast_member_tuple
            season_cast_names[name] = True
            cast_member_roles.append((name, cast_member.get("role")))
        create_season_roles(set(cast_member_roles), season)

        episodes = imdb.episodes(season)
        get_imdb_episodes(episodes, season_cast_names)

    save_cast_members()
    save_episodes()
    save_credits()
    save_roles()
    save_failed()


if __name__ == "__main__":
    # set logging for other modules to error
    # so that they aren't shown
    logging.basicConfig(level=logging.ERROR)
    run()
