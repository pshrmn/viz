import re

ROLE_REG = re.compile("(Bee|Various|Weekend Update Anchor)")
MULTIPLE_ROLES_REG = re.compile(" / ")
ALT_REG = re.compile("(Host|Musical Guest)")
UNCREDITED = re.compile("\(uncredited\)")


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

    For some reason, in some credits on imdb cast members are credited with
    the role of "Bee"...
    """
    if description is None:
        return False
    return (ROLE_REG.search(description) is not None or
            MULTIPLE_ROLES_REG.search(description) is not None) and \
        UNCREDITED.search(description) is None


def credited(description):
    if description is None:
        return False
    return UNCREDITED.search(description) is None


def not_alternate(description):
    """
    Figure out if someone has an alternate role from a regular cast member
    in an episode (eg. host). The host of an episode is marked as "Host"
    in the description, so filter them out based on that. Similarly,
    the musical guest is marked as "Musical Guest".
    """
    if description is None:
        return False
    return ALT_REG.search(description) is None


def only_cast(description):
    """
    Return True if the description matches the requirements for a cast member
    but the person is not the Host or Musical Guest.
    """
    if description is None:
        return False
    return cast_member(description) and not_alternate(description)
