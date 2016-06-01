"""
Iterate over every episode of Saturday Night Live and make note of
which cast members appear in which episodes.
"""
import json
import argparse
import os

from snl.fetch.wiki import cast

LOCAL_DIR = os.path.dirname(__file__)
os.makedirs(os.path.join(LOCAL_DIR, "data", "casts"), exist_ok=True)


def get_cast(season):
    data = cast(season)
    with open("data/casts/season_{}_cast.json".format(season), "w") as fp:
        json.dump(data, fp)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Get the main cast and featured playes for a season")
    parser.add_argument("--season", "-S", dest="season", help="Which season (1-41)", type=int)
    args = parser.parse_args()

    get_cast(args.season)
