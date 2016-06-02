"""
Basic information on an actor.
"""
import json
import argparse
import os

from snl.fetch.tomatoes import profile

SCRIPTS_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.abspath(os.path.join(SCRIPTS_DIR, os.pardir))
os.makedirs(os.path.join(BASE_DIR, "data", "actors"), exist_ok=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Get basic information on an actor")
    parser.add_argument("--url", "-U", dest="url", help="Rotten Tomatoes URL of actor")
    parser.add_argument("--name", "-N", dest="name", help="The name of the actor")
    args = parser.parse_args()

    url = args.url
    name = args.name
    filename_name = name.replace(" ", "_")
    data = profile(url)
    # format to play nice with json
    if data["birthdate"] is not None:
        data["birthdate"] = data["birthdate"].strftime("%Y-%m-%d")
    with open("data/actors/{}.json".format(filename_name), "w") as fp:
        json.dump(data, fp)
