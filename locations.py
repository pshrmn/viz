"""
get the locations of the members of a college football team
uses espn to get the current roster
uses wikipedia to get the coordinates of a player's hometown
"""

import json
import argparse

from gatherer import Page, Fetch, Cache
from wikinfo.geo import city

with open("roster.json") as fp:
    roster_rules = json.load(fp)

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
        return
    elif hometown in KNOWN_CITIES:
        return KNOWN_CITIES[hometown]
    else:
        city, state = map(str.strip, hometown.split(",", 1))
        coords = wiki_city.coordinates(city, state)
        KNOWN_CITIES[hometown] = coords
        return coords


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
    position_locs = {}
    coords = []
    for p in players:
        loc = get_coordinates(p["hometown"])
        if loc is not None:
            pos = p["position"]
            coords.append(loc)
            pos_coords = position_locs.get(pos, [])
            pos_coords.append(loc)
            position_locs[pos] = pos_coords
    return {
        "coords": coords,
        "positions": position_locs
    }


def get_team(filename, url):
    team = team_coordinates(url)
    if not team:
        return
    with open("data/{}".format(filename), "w") as fp:
        json.dump(team, fp, indent=2)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('-url', dest='url',
                        help='espn.com url for team roster')
    parser.add_argument('-filename', dest='filename',
                        help='location to save data')
    args = parser.parse_args()
    url = args.url
    filename = args.filename or "output.json"
    get_team(filename, url)

