import json
import os

from gatherer import Page
from snl.fetch import get_dom
from snl.fetch.helpers import parse_date, infer_gender

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "actor.json")) as fp:
    actor_json = json.load(fp)

actor_page = Page.from_json(actor_json)


def clean_profile(data):
    if data is None:
        return
    return {
        "name": data.get("name"),
        "birthdate": parse_date(data.get("birthdate")),
        "hometown": data.get("hometown"),
        "gender": infer_gender(data.get("description")),
        "roles": data.get("roles")
    }


def profile(actor_url):
    """
    return a dict with the data for a season of Saturday Night Live episodes.
    The input dict will have the form:
    {
        "name": <string>,
        "birthdate": <string>,
        "hometown": <string>,
        "description": <string>,
        "roles": [
            {
                "title": <string>,
                "url": <string>,
                "release": <string>
            }
        ]
    }

    and the returned dict will have the form:
    {
        "name": <string>,
        "birthdate": <date>,
        "hometown": <string>,
        "gender": <string>,
        "roles": [
            {
                "title": <string>,
                "url": <string>,
                "release": <string>
            }
        ]
    }

    """
    dom = get_dom(actor_url)
    if dom is None:
        print("failed to get season data")
        return
    else:
        return clean_profile(actor_page.gather(dom))
