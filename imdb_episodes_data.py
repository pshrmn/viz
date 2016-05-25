"""
Iterate over every episode of Saturday Night Live and make note of
which cast members appear in which episodes.
"""
import json
import argparse

from snl.imdb import episodes, cast


def get_season_casts(season):
    casts = []
    for episode in episodes(season).get("episodes", []):
        episode_cast = cast(episode.get("url"))
        casts.append(episode_cast)
    return casts


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Get the cast members for each episode of a season")
    parser.add_argument("--season", "-S", dest="season", help="Which season (1-41)", type=int)
    args = parser.parse_args()

    season = args.season

    data = get_season_casts(season)
    with open("data/season_{}_episode_casts.json".format(season), "w") as fp:
        json.dump(data, fp)
