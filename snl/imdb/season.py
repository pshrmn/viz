import json
import os

from gatherer import Page
from snl.pages import get

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "season.json")) as fp:
    season_json = json.load(fp)

season_page = Page.from_json(season_json)


def season_url(season_number):
    """
    returns the url for the imdb page for a given season of saturday night live
    currently there are 41 seasons. Any numbers outside of the range 1-41 will
    return the most recent season.
    """
    return "http://www.imdb.com/title/tt0072562/episodes?season={}".format(season_number)


def episodes(season):
    """
    return a dict with the data for a season of Saturday Night Live episodes.
    The dict will have the form:
    {
        "episodes": [
            {
                "url": "...",
                "date": "..."
            }
        ]
    }
    """
    url = season_url(season)
    dom = get(url)
    if dom is None:
        print("failed to get season data")
        return
    else:
        return season_page.gather(dom)
