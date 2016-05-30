"""
Iterate over every episode of Saturday Night Live and make note of
which cast members appear in which episodes.
"""
import json
import argparse
import os

from snl.imdb.actor import profile

LOCAL_DIR = os.path.dirname(__file__)
os.makedirs(os.path.join(LOCAL_DIR, "data", "actors"), exist_ok=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Get basic information on an actor")
    parser.add_argument("--url", "-U", dest="url", help="IMDB URL of actor")
    parser.add_argument("--name", "-N", dest="name", help="The name of the actor")
    args = parser.parse_args()

    url = args.url
    name = args.name
    filename_name = name.replace(" ", "_")
    data = profile(url)
    with open("data/actors/{}.json".format(filename_name), "w") as fp:
        json.dump(data, fp)
