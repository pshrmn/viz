import argparse
import json

from snl.db import connect, queries


def writeable_date(date):
    if date is None:
        return
    elif isinstance(date, str):
        return date
    return date.strftime("%Y-%m-%d")


def cast_member_data(session):
    cast_members = queries.cast_member_role_seasons(session)
    for row in queries.starting_age(session):
        name, age, dob, air_date = row
        if name not in cast_members:
            continue
        cast_members[name].update({
            "start_age": age,
            "first_episode": writeable_date(air_date)
        })
    for row in queries.ending_age(session):
        name, age, dob, air_date = row
        if name not in cast_members:
            continue
        cast_members[name].update({
            "end_age": age,
            "last_episode": writeable_date(air_date)
        })

    for row in queries.total_credits(session):
        count, name = row
        if name not in cast_members:
            continue
        cast_members[name]["credits"] = count

    return list(cast_members.values())


def season_data(session):
    seasons = queries.season_gender_ratios(session)
    for season in queries.episodes_per_season(session):
        number, count = season
        seasons[number]["season"] = number
        seasons[number]["episodes"] = count
    return list(seasons.values())


def run(session):
    return {
        "cast_members": cast_member_data(session),
        "seasons": season_data(session)
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Query data from the database")
    parser.add_argument
    parser.add_argument("--database", "-DB", dest="db_url", default="sqlite:///data/snl.db",
                        help="The database's URL")
    parser.add_argument("--echo", "-E", dest="echo", action="store_true", help="echo sql statements")
    args = parser.parse_args()

    session = connect(args.db_url, args.echo)
    data = run(session)
    with open("./data/stats.json", "w") as fp:
        json.dump(data, fp, indent=2)
