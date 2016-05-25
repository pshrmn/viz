import json
import os
import re
from urllib.parse import urlparse, urlunparse

from gatherer import Page
from snl.pages import get

LOCAL_DIR = os.path.dirname(__file__)
RULES_DIR = os.path.join(LOCAL_DIR, "rules")

ROLE_REG = re.compile("(Various|Weekend Update Anchor)")
MULTIPLE_ROLES_REG = re.compile(" / ")
ALT_REG = re.compile("(Host|Musical Guest)")

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


def cast_member(description):
    """
    There isn't a perfect system for deciding that an actor is a cast
    member, but there are a few indicators of one. These will all be
    done by checking the actor's description:

    Various / ... (21 episodes, 2013-2014)

    For most cast members, the word "Various" will be included in the
    description. For cast members who anchor Weekend Update, the string
    "Weekend Update Anchor" will be in their description. Some descriptions
    do not include the "Various" string, but there will be multiple roles
    which are separated by spaces and forward slashes (" / ").

    This will miss some people, especially in earlier seasons, but for
    the most part will correctly separate the cast members from others
    """
    return (ROLE_REG.search(description) is not None or
            MULTIPLE_ROLES_REG.search(description) is not None)


def not_alternate(description):
    """
    Figure out if someone has an alternate role from a regular cast member
    in an episode (eg. host). The host of an episode is marked as "Host"
    in the description, so filter them out based on that. Similarly,
    the musical guest is marked as "Musical Guest".
    """
    return ALT_REG.search(description) is None


def only_cast(description):
    return cast_member(description) and not_alternate(description)


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
                "name": "...",
                "profile": "...",
                "description": "..."
            }
        ]
    }
    """
    dom = get(full_credits_url(episode_url))
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
