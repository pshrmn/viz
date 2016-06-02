import re

MAIN_REG = re.compile("Repertory")


def main_cast_member(title):
    """
    On Wikipedia, the cast members for a given season are sorted into
    columns. Each column has a title. The title of the column with the
    main cast always includes the word "Repertory".
    """
    if title is None:
        return False
    return MAIN_REG.search(title) is not None
