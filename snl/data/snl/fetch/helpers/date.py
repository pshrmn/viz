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
    # remove any extra whitespace, periods (want Jan not Jan.), and commas
    clean_string = re.sub(r"\s+", " ", date_string).replace(".", "").replace(",", "")
    try:
        return datetime.strptime(clean_string, "%b %d %Y").date()
    except ValueError:
        return None


def day_month_year(date_string):
    if date_string is None:
        return None
    clean_string = re.sub(r"\s+", " ", date_string).replace(".", "").replace(",", "")
    try:
        return datetime.strptime(clean_string, "%d %b %Y").date()
    except ValueError:
        return None


def Y_m_d(date_string):
    """
    date format: <year>-<month>-<day> eg 1980-12-02
    """
    if date_string is None:
        return None
    clean_string = re.sub(r"\s+", " ", date_string).replace(".", "").replace(",", "")
    try:
        return datetime.strptime(clean_string, "%Y-%m-%d").date()
    except ValueError:
        return None
