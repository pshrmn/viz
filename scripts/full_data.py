import logging
import csv
import os

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
1.  Rotten Tomatoes is missing season 38 episode 15 (hosted by Kevin Hart).
    All episodes after that are listed one number earlier and the season
    finale is listed twice (although the second one contains no cast).
2.  Several actors have incomplete profiles on Rotten Tomatoes. These include:
    John Milhiser
    Brooks Wheelan
    Pete Davidson
    Jon Rudnitsky
"""


def save_csv(header, rows, filename):
    with open("{}/{}".format(OUTPUT_DIR, filename), "w", newline="") as fp:
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
    return date.strftime("%Y-%m-%d")


def create_episode(data):
    """
    add an Episode to the database and return the row
    """
    season = data.get("season")
    episode = data.get("episode")
    air_date = data.get("air_date")
    EPISODE_ROWS.append((season, episode, writeable_date(air_date)))


def create_episode_credits(member_names, season, episode):
    """
    for each cast member that appeared in an episode, add a Credit to them
    in the database
    """
    for name in member_names:
        CREDIT_ROWS.append((name, season, episode))


def create_cast_member(data):
    name = data.get("name")
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
            # check if the actor exists in our db
            season_cast_members[name] = member_type
    return season_cast_members


def fetch_cast_member(url):
    profile = tomatoes.profile(url)
    if profile is None:
        FAILED_ROWS.append((url,))
        return
    logger.info(profile.get("name"))
    return create_cast_member(profile)


def get_season_cast(season, cast_members, season_cast_members, known_cast):
    # for each actor that appears in a season, check if they are a cast
    # member. if they are, make sure that their data has been fetched
    cast_member_roles = []
    for actor in cast_members:
        name = actor.get("name")
        url = actor.get("url")
        if name not in season_cast_members:
            continue
        elif name not in known_cast:
            cast_member = fetch_cast_member(url)
            if cast_member is not None:
                known_cast[name] = cast_member
    for (name, role) in season_cast_members.items():
        cast_member_roles.append((name, role))
    create_season_roles(set(cast_member_roles), season)


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
            name = person["name"]
            if name in season_cast_members:
                cast_member_names.append(name)
        create_episode_credits(
            set(cast_member_names),
            episode.get("season"),
            episode.get("episode")
        )


def run():
    # a dict containing references to all actors that are in the database
    # the key is the actor's name
    known_cast = {}

    for season in range(1, SEASON_COUNT + 1):
        logger.info("Getting Season {}".format(season))
        season_cast_members = season_cast(season)
        rt_season_data = tomatoes.season(season)

        get_season_cast(
            season,
            rt_season_data.get("cast_members"),
            season_cast_members,
            known_cast
        )

        episodes = imdb.episodes(season)
        get_imdb_episodes(episodes, season_cast_members)

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
