import json
import argparse


def get_team(name, conference):
    team_filename = "data/{}.json".format(name.lower().replace(" ", "_"))
    with open(team_filename) as fp:
        team_json = json.load(fp)
        team_json["conference"] = conference
    return team_json


def combine_teams(conference, teams):
    output = "data/{}.json".format(conference)
    combined = [get_team(team, conference) for team in teams]
    with open(output, "w") as fp:
        json.dump({
            "name": conference,
            "teams": combined
        }, fp, sort_keys=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-name", dest="name",
                        help="name of the conference")
    parser.add_argument("-teams", dest="teams", nargs="+",
                        help="names of the colleges in the conference")
    args = parser.parse_args()
    combine_teams(args.name, args.teams)
