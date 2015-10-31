"""
get the locations of the members of a college football team
uses espn to get the current roster
uses wikipedia to get the coordinates of a player's hometown
"""

import json
import argparse

from gatherer import Page, Fetch, Cache
from wikinfo.geo import city

# load the rules to get a roster's players' position & hometown
with open("roster.json") as fp:
    roster_rules = json.load(fp)

# load a dict with the urls for all of the FBS D1-A teams' roster urls
with open("team_pages.json") as fp:
    teams = json.load(fp)

cache = Cache("cache")
wiki_city = city.City(city.city_rule_set, {
    "headers": {"User-Agent": "gatherer"},
    "sleep_time": 0,
    "cache": cache
})

fetcher = Fetch(headers={"User-Agent": "gatherer"}, cache=cache)
roster_page = Page.from_json(roster_rules)
KNOWN_CITIES = {}


def get_roster(url):
    """
    given the url (on espn.com) for a football team, return an array of dicts
    with hometown and position keys
    """
    dom = fetcher.get(url)
    roster = roster_page.gather(dom)
    return roster


def get_coordinates(hometown):
    if hometown == "--":
        return None, None
    elif hometown in KNOWN_CITIES:
        return KNOWN_CITIES[hometown]
    else:
        city, state = map(str.strip, hometown.split(",", 1))
        longitude, latitude = wiki_city.coordinates(city, state)
        if longitude is not None and latitude is not None:
            coords = (longitude, latitude)
            KNOWN_CITIES[hometown] = coords
            return coords
        else:
            return None, None


def player_info(player):
    # get the location of a player's hometown
    hometown = player["hometown"]
    longitude, latitude = get_coordinates(hometown)
    if longitude is None or latitude is None:
        return None
    city, state = map(str.strip, hometown.split(",", 1))

    return {
        "position": player["position"],
        "city": city,
        "state": state,
        "longitude": longitude,
        "latitude": latitude
    }


def team_coordinates(url):
    """
    for each player on a team, get the coordinates of their hometown
    returns a list of all coordinates for a team and a dict or coordinates
    grouped by position
    """
    team = get_roster(url)
    if not team:
        return
    players = team["players"][1:]
    data = []
    for player in players:
        info = player_info(player)
        if info is not None:
            data.append(info)
    return data


def get_team(name):
    # teams are saved as lower case
    lower_name = name.lower()
    if lower_name not in teams:
        print("could not find team: {}".format(name))
        return
    url = teams[lower_name]
    team = team_coordinates(url)
    if not team:
        return
    filename = lower_name.replace(" ", "_")
    with open("data/{}.json".format(filename), "w") as fp:
        json.dump(team, fp, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-teams", dest="teams", nargs="+",
                        help="name of the college")
    args = parser.parse_args()
    for team in args.teams:
        get_team(team)
