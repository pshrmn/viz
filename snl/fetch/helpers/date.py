import re
from datetime import datetime


def parse_date(date_string):
    """
    The format of the date should be "<Month> <Day>, <Year>"
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
