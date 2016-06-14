"""
This relies on the csv files created by full_data
"""

import os
import csv
from datetime import datetime
import argparse

from snl import db


def load_cast_members(csv_path):
    CAST_MEMBER_FILENAME = "full_cast_members.csv"
    return load_csv_file(os.path.join(csv_path, CAST_MEMBER_FILENAME))


def load_episodes(csv_path):
    EPISODE_FILENAME = "episodes.csv"
    return load_csv_file(os.path.join(csv_path, EPISODE_FILENAME))


def load_roles(csv_path):
    ROLE_FILENAME = "roles.csv"
    return load_csv_file(os.path.join(csv_path, ROLE_FILENAME))


def load_credits(csv_path):
    CREDIT_FILENAME = "credits.csv"
    return load_csv_file(os.path.join(csv_path, CREDIT_FILENAME))


def load_csv_file(filename):
    rows = []
    with open(filename, newline="", encoding="utf-8") as fp:
        reader = csv.reader(fp)
        first = True
        for row in reader:
            # skip the header
            if first:
                first = False
                continue
            rows.append(row)
    return rows


def parse_date(date):
    if date is None:
        return
    return datetime.strptime(date, "%Y-%m-%d")


def run(session, csv_path):
    # keep track of the episode ids in the database
    saved_episodes = {}
    # keep track of the cast member ids in the database
    saved_cast_members = {}

    # save all of the cast members at once
    cms_to_save = []
    for cm in load_cast_members(csv_path):
        name, dob, hometown, gender = cm
        if hometown == "":
            hometown = None
        if dob == "":
            dob = None
        dob = parse_date(dob)
        member_row = db.CastMember(name=name, dob=dob, hometown=hometown, gender=gender)
        cms_to_save.append(member_row)
        saved_cast_members[name] = member_row
    session.add_all(cms_to_save)

    # save all of the rows at once
    eps_to_save = []
    for ep in load_episodes(csv_path):
        season, episode, air_date = ep
        air_date = parse_date(air_date)
        episode_row = db.Episode(air_date=air_date, season=season, episode=episode)
        eps_to_save.append(episode_row)
        if season not in saved_episodes:
            saved_episodes[season] = {}
        saved_episodes[season][episode] = episode_row
    session.add_all(eps_to_save)

    # commit now so that we have ids associated with the saved rows
    session.commit()

    unknowns = set()
    roles_to_save = []
    for role in load_roles(csv_path):
        cast_member, season, _type = role
        if cast_member not in saved_cast_members:
            print("Unknown Cast Member for role: {}\n{}".format(cast_member, role))
            unknowns.add(cast_member)
            continue
        cast_member_row = saved_cast_members[cast_member]
        cast_member_id = cast_member_row.id
        role = db.Role(cast_member_id=cast_member_id, season=season, main=_type == "main_cast")
        roles_to_save.append(role)
    session.add_all(roles_to_save)

    credits_to_save = []
    for credit in load_credits(csv_path):
        cast_member, season, episode = credit
        if cast_member not in saved_cast_members:
            print("Unknown Cast Member for credit: {}\n{}".format(cast_member, credit))
            continue
        cast_member_row = saved_cast_members[cast_member]
        cast_member_id = cast_member_row.id

        if season not in saved_episodes:
            print("Unknown Season: {}".format(season))
            continue
        seasons = saved_episodes[season]
        if episode not in seasons:
            print("Unknown Episode: s{}e{}".format(season, episode))
            continue
        episode_row = seasons[episode]
        episode_id = episode_row.id

        credit = db.Credit(cast_member_id=cast_member_id, episode_id=episode_id)
        credits_to_save.append(credit)
    session.add_all(credits_to_save)
    # and save the roles/credits
    session.commit()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import the data from csv files to a database")
    parser.add_argument
    parser.add_argument("--database", "-DB", dest="db_url", default="sqlite:///data/snl.db",
                        help="The database's URL")
    parser.add_argument("--echo", "-E", dest="echo", action="store_true", help="echo sql statements")
    parser.add_argument("--csv", dest="csv", default="./data/full/",
                        help="path to folder that contains the csv files")
    args = parser.parse_args()

    session = db.connect(args.db_url, args.echo)
    run(session, args.csv)
