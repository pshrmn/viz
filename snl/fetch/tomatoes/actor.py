import json
import os

from gatherer import Page
from snl.fetch import get_dom
from snl.fetch.helpers import full_month, infer_gender

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "actor.json")) as fp:
    actor_json = json.load(fp)

actor_page = Page.from_json(actor_json)
"""
actor_page gathers data formatted as:
{
    "name": <string>,
    "information": [
        {
            "key": <string>,
            "value": <string>
        }
    ],
    "movies": [
        "score": <int>,
        "title": <string>,
        "url": <string>,
        "year": <string>,
        "role": <string>,
        "box-office": <string>
    ],
    "shows": [
        "title": <string>,
        "url": <string>,
        "role": <string>,
        "appeared": <string>
    ]
}

The actor's birthdate and birthplace can be found in the information array.
The birthdate is the value where the key is "Birthday:" and the actor's
birthplace is the value where the key is "Birthplace:". The birthplace will
be assumed to be the actor's hometown unless found to be otherwise.
"""


def clean_profile(data):
    if data is None:
        return
    birthdate = None
    hometown = None
    bio = None
    for info in data.get("information"):
        key, value = info.get("key"), info.get("value")
        if key == "Birthday:":
            birthdate = full_month(value)
        elif key == "Birthplace:":
            hometown = value if value != "Not Available" else None
        elif key == "Bio:":
            bio = value
    return {
        "name": data.get("name"),
        "birthdate": birthdate,
        "hometown": hometown,
        "gender": infer_gender(bio)
    }


def profile(url):
    dom = get_dom(url)
    if dom is None:
        print("failed to get episode for url {}".format(url))
        return
    data = actor_page.gather(dom)
    if data is None:
        print("failed to get data for episode at url {}".format(url))
        return
    return clean_profile(data)
