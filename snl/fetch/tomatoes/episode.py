import json
import os
import re

from gatherer import Page
from snl.fetch import get_dom
from snl.fetch.helpers import abbr_month

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "episode.json")) as fp:
    episode_json = json.load(fp)

episode_page = Page.from_json(episode_json)
"""
episode_page gathers data formatted as:
{
    "air_date": <string>,
    "cast": [
        "name": <string>,
        "profile": <string>
    ]
}
"""


def episode_url(season, episode):
    # {index:<fill><len><type>}
    return "https://www.rottentomatoes.com/tv/saturday-night-live/s{0:02d}/e{1:02d}/".format(
        season, episode
    )


def clean_episode(season, episode, data):
    """
    transform the data into the desired format
    """
    return {
        "season": season,
        "episode": episode,
        "air_date": abbr_month(data.get("air_date")),
        "cast": data.get("cast")
    }


def episode(season, episode):
    url = episode_url(season, episode)
    dom = get_dom(url)
    if dom is None:
        print("failed to get episode for url {}".format(url))
        return
    data = episode_page.gather(dom)
    if data is None:
        print("failed to get data for episode at url {}".format(url))
        return
    return clean_episode(season, episode, data)


def parse_url(url):
    """
    get the season and episode of an episode based on the url
    """
    matches = re.search(r"s(?P<season>\d+)/e(?P<episode>\d+)", url)
    if matches is None:
        return None, None
    else:
        obj = matches.groupdict()
        return int(obj.get("season")), int(obj.get("episode"))


def episode_by_url(url):
    dom = get_dom(url)
    if dom is None:
        print("failed to get episode for url {}".format(url))
        return
    data = episode_page.gather(dom)
    if data is None:
        print("failed to get data for episode at url {}".format(url))
        return
    season, episode = parse_url(url)
    return clean_episode(season, episode, data)
