"""
Iterate over every episode of Saturday Night Live and make note of
which cast members appear in which episodes.
"""
import json
import argparse

from snl.wiki import cast

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Get the main cast and featured playes for a season")
    parser.add_argument("--season", "-S", dest="season", help="Which season (1-41)", type=int)
    args = parser.parse_args()

    season = args.season

    data = cast(season)
    with open("data/season_{}_cast.json".format(season), "w") as fp:
        json.dump(data, fp)
