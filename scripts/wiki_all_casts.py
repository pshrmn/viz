"""
Iterate over every episode of Saturday Night Live and make note of
which cast members appear in which episodes.
"""
import json
import os

from snl.fetch.wiki import cast

SCRIPTS_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.abspath(os.path.join(SCRIPTS_DIR, os.pardir))
os.makedirs(os.path.join(BASE_DIR, "data", "casts"), exist_ok=True)


def get_cast(season):
    data = cast(season)
    with open("data/casts/season_{}_cast.json".format(season), "w") as fp:
        json.dump(data, fp)

if __name__ == "__main__":
    for season in range(1, 42):
        print("getting season {}".format(season))
        get_cast(season)
