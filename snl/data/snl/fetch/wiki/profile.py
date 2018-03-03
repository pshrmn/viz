import json
import os

from gatherer import Page
from snl.fetch import fetcher
from snl.fetch.helpers import Y_m_d, infer_gender

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "profile.json")) as fp:
    profile_json = json.load(fp)

profile_page = Page.from_json(profile_json)


def clean_profile(data):
    if data is None:
        return
    return {
        "name": data.get("name"),
        "hometown": data.get("birthplace"),
        "birthdate": Y_m_d(data.get("birthdate")),
        "gender": infer_gender(data.get("description"))
    }


def profile(url):
    dom = fetcher.get(url)
    if dom is None:
        print("failed to get profile data")
        return
    else:
        data = profile_page.gather(dom)
        return clean_profile(data)
