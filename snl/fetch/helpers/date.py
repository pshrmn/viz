import re
from datetime import datetime


def full_month(date_string):
    """
    The format of the date should be "<Month> <Day>, <Year>" where
    the month is fully written out
    For example:
    February 29, 2016
    """
    if date_string is None:
        return None
    clean_string = re.sub(r"\s+", " ", date_string)
    try:
        return datetime.strptime(clean_string, "%B %d, %Y").date()
    except ValueError:
        return None


def abbr_month(date_string):
    """
    The format of the date should be "<Month> <Day>, <Year>" where
    the month is abbreviated to the first three letters
    For example:
    Feb 29, 2016
    """
    if date_string is None:
        return None
    clean_string = re.sub(r"\s+", " ", date_string)
    try:
        return datetime.strptime(clean_string, "%b %d, %Y").date()
    except ValueError:
        return None
