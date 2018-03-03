import re

REP_REG = re.compile("Repertory")


def repertory_cast_member(title):
    """
    On Wikipedia, the cast members for a given season are sorted into
    columns. Each column has a title. The title of the column with the
    repertory cast always includes the word "Repertory".
    """
    if title is None:
        return False
    return REP_REG.search(title) is not None
