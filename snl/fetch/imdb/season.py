import json
import os

from gatherer import Page
from snl.fetch import fetcher
from snl.fetch.helpers import day_month_year

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


def clean_episodes(data, season):
    """
    convert episodes to the desired format
    """
    if data is None:
        return []
    episodes = []
    for (number, episode) in enumerate(data.get("episodes")):
        episodes.append({
            "season": season,
            "episode": number + 1,
            "url": episode.get("url"),
            "air_date": day_month_year(episode.get("date"))
        })
    return episodes


def episodes(season):
    """
    return a list with the data for a season of Saturday Night Live episodes.
    The gathered dict will have the form:
    {
        "episodes": [
            {
                "url": <string>,
                "date": <string>
            }
        ]
    }
    The returned data will have the format
    [
        {
            "season": <int>,
            "episode": <int>,
            "url": <string>
            "air_date": <string>
        }
    ]


    """
    url = season_url(season)
    dom = fetcher.get(url)
    if dom is None:
        print("failed to get season data")
        return
    else:
        return clean_episodes(season_page.gather(dom), season)
