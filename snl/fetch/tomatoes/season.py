import json
import os

from gatherer import Page
from snl.fetch import get_dom

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "season.json")) as fp:
    season_json = json.load(fp)

season_page = Page.from_json(season_json)
"""
season_page gathers data formatted as:
{
    "episodes": [
        {
            "url": <string>
        }
    ],
    "cast_members": [
        {
            "name": <string>,
            "url": <string>
        }
    ]
}
"""


def season_url(season):
    # {index:<fill><len><type>}
    return "https://www.rottentomatoes.com/tv/saturday-night-live/s{0:02d}/".format(season)


def season(season,):
    url = season_url(season)
    dom = get_dom(url)
    if dom is None:
        print("failed to get season for url {}".format(url))
        return
    data = season_page.gather(dom)
    if data is None:
        print("failed to get data for season at url {}".format(url))
        return
    return {
        "season": season,
        "episodes": data.get("episodes"),
        "cast_members": data.get("cast_members")
    }
