import re

FEMALE_WORDS = re.compile(r"\b([hH]er|[sS]he)\b")
MALE_WORDS = re.compile(r"\b([hH]is|[hH]e|[hH]im)\b")


def infer_gender(description):
    """
    Infer the gender of an actor based on their description.
    If there are more instances of her/she than his/he/him, it is
    probably a female, and male for the inverse. If the counts
    are equal or there are no instances of either, return None.
    """
    if description is None:
        return None

    female_matches = re.findall(FEMALE_WORDS, description)
    female_count = len(female_matches)
    male_matches = re.findall(MALE_WORDS, description)
    male_count = len(male_matches)
    if female_count > male_count:
        return "female"
    elif male_count > female_count:
        return "male"
    else:
        return None
