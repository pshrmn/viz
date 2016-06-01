import json
import os
import re
from urllib.parse import urlparse, urlunparse

from gatherer import Page
from snl.fetch import get_dom
from snl.fetch.helpers import only_cast

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

with open(os.path.join(RULES_DIR, "cast.json")) as fp:
    cast_json = json.load(fp)

cast_page = Page.from_json(cast_json)


def full_credits_url(episode_url):
    """
    Given the url for an episode, append "fullcredits"
    to the path to get the link to the page will the
    full cast of an episode.
    """
    url_parts = urlparse(episode_url)
    start_path = url_parts.path
    # if the path ends with fullcredits, already have the
    # correct url
    if start_path.endswith("/fullcredits"):
        return episode_url
    else:
        full_path = "{}{}".format(start_path, "fullcredits")
        full_credit_parts = url_parts._replace(path=full_path)
        return urlunparse(full_credit_parts)


def clean_actor(actor):
    """
    """
    url = urlparse(actor.get("profile"))
    no_ref = url._replace(query=None)
    clean_profile = urlunparse(no_ref)

    clean_description = re.sub("\s+", " ", actor.get("description"))

    return {
        "name": actor.get("name"),
        "profile": clean_profile,
        "description": clean_description
    }


def all_cast(episode_url):
    """
    return a dict with the data on the cast members that appeared in an
    episode of Saturday Night Live.
    The dict will have the form:
    {
        "actors": [
            {
                "name": <string>,
                "profile": <string>,
                "description": <string>
            }
        ]
    }
    """
    dom = get_dom(full_credits_url(episode_url))
    if dom is None:
        print("failed to get episode cast data")
        return
    else:
        cast_data = cast_page.gather(dom)
        return [clean_actor(actor) for actor in cast_data.get("actors")]


def only_regular_cast(episode_url):
    """
    return the filtered results from all_cast where only the actors
    who are regular cast members (based on the only_cast requirements)
    are listed
    """
    return [actor for actor in all_cast(episode_url) if only_cast(actor.get("description"))]
