import os
import csv

from snl import db

session = db.connect("sqlite:///snl.db")

SCRIPTS_DIR = os.path.dirname(__file__)
BASE_DIR = os.path.abspath(os.path.join(SCRIPTS_DIR, os.pardir))
DATA_DIR = os.path.join(BASE_DIR, "data", "full")


def load_cast_members():
    CAST_MEMBER_FILENAME = "cast_members.csv"
    return load_csv_file(CAST_MEMBER_FILENAME)


def load_episodes():
    EPISODE_FILENAME = "episodes.csv"
    return load_csv_file(EPISODE_FILENAME)


def load_roles():
    ROLE_FILENAME = "roles.csv"
    return load_csv_file(ROLE_FILENAME)


def load_credits():
    CREDIT_FILENAME = "credits.csv"
    return load_csv_file(CREDIT_FILENAME)


def load_csv_file(filename):
    rows = []
    with open(os.path.join(DATA_DIR, filename)) as fp:
        reader = csv.reader(fp)
        first = True
        for row in reader:
            # skip the header
            if first:
                first = False
                continue
            rows.append(row)
    return rows


def run():
    cast_members = load_cast_members()
    episodes = load_episodes()
    roles = load_roles()
    credits = load_credits()
    # keep track of the episode ids in the database
    saved_epiodes = {}
    # keep track of the cast member ids in the database
    saved_cast_members = {}

    # save all of the cast members at once
    cms_to_save = []
    for cm in cast_members:
        # name, dob, hometown, gender
        name, dob, hometown, gender = cm
        member_row = db.CastMember(name=name, dob=dob, hometown=hometown, gender=gender)
        cms_to_save.append(member_row)
        saved_cast_members[name] = member_row
    session.save_all(cms_to_save)


if __name__ == "__main__":
    run()
