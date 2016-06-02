"""
Iterate over every episode of Saturday Night Live and make note of
which cast members appear in which episodes.
"""
import json
import argparse
import os

from snl.fetch.imdb import episodes, only_regular_cast

LOCAL_DIR = os.path.dirname(__file__)
os.makedirs(os.path.join(LOCAL_DIR, "data", "episodes"), exist_ok=True)


def get_season_casts(season):
    casts = []
    for episode in episodes(season).get("episodes", []):
        episode_cast = only_regular_cast(episode.get("url"))
        casts.append(episode_cast)
    return casts


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Get the cast members for each episode of a season")
    parser.add_argument("--season", "-S", dest="season", help="Which season (1-41)", type=int)
    args = parser.parse_args()

    season = args.season

    data = get_season_casts(season)
    with open("data/episodes/season_{}_episode_casts.json".format(season), "w") as fp:
        json.dump(data, fp)
