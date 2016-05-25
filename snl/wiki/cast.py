import json
import os

from gatherer import Page
from snl.pages import get

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "cast.json")) as fp:
    cast_json = json.load(fp)

cast_page = Page.from_json(cast_json)


def cast(season):
    """
    return a dict with the data for a season of Saturday Night Live episodes.
    The dict will have the form:
    {
        "main_cast": [
            {
                "name": "...",
                "profile": "..."
            }
        ],
        "featured_players": [
            {
                "name": "...",
                "profile": "..."
            }
        ]
    }
    """

    url = "https://en.wikipedia.org/wiki/Saturday_Night_Live_(season_{})".format(season)
    dom = get(url)
    if dom is None:
        print("failed to get season data")
        return
    else:
        return cast_page.gather(dom)
