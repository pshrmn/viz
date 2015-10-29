import json
import argparse


def combine_teams(conference, teams):
    output = "data/{}.json".format(conference)
    combined = {}
    for team in teams:
        team_filename = "data/{}.json".format(team.replace(" ", "_"))
        with open(team_filename) as fp:
            team_json = json.load(fp)
            combined[team] = team_json["coords"]
    with open(output, "w") as fp:
        json.dump(combined, fp, sort_keys=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-conference", dest="conf",
                        help="name of the conference")
    parser.add_argument("-teams", dest="teams", nargs="+",
                        help="names of the colleges in the conference")
    args = parser.parse_args()
    combine_teams(args.conf, args.teams)
