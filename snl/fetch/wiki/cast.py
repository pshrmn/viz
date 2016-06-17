import json
import os

from gatherer import Page
from snl.fetch import fetcher
from snl.fetch.helpers import repertory_cast_member

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "cast.json")) as fp:
    cast_json = json.load(fp)

cast_page = Page.from_json(cast_json)


def sort_actors(casts):
    repertory = []
    featured = []
    for cast_group in casts:
        for members in cast_group.get("members"):
            if repertory_cast_member(members.get("description")):
                repertory.extend(members.get("actors"))
            else:
                featured.extend(members.get("actors"))
    return {
        "repertory": repertory,
        "featured": featured
    }


def cast(season):
    """
    return a dict with the data for a season of Saturday Night Live episodes.
    The gathered data will be broken into an array of casts. Each one will
    have a title describing which type of actors are listed in that array.

    {
        "casts": [
            "members": [
                {
                    "description": <string>
                    "actors": [
                        {
                            "name": <string>,
                            "profile": <string>
                        }
                    ]
                }
            ]
        ]
    }

    The repertory cast members will always be in a column which includes the word
    "Repertory" in it. For the purposes of this, cast members in any column
    that does not contain the word "Repertory" in its title will be considered
    "Featured Players".

    The return dict will have the form:
    {
        "repertory": [
            {
                "name": <string>,
                "profile": <string>
            }
        ],
        "featured": [
            {
                "name": <string>,
                "profile": <string>
            }
        ]
    }
    """

    url = "https://en.wikipedia.org/wiki/Saturday_Night_Live_(season_{})".format(season)
    dom = fetcher.get(url)
    if dom is None:
        print("failed to get season data")
        return
    else:
        data = cast_page.gather(dom)
        return sort_actors(data.get("casts"))
