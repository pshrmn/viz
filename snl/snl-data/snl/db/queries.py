from sqlalchemy import func

from .models import CastMember, Episode, Credit, Role


"""
Season Queries
"""


def season_gender_ratios(session):
    """
    the count of male and female cast members in a given season, both in general
    and by the type of their role
    """
    all_roles = session.query(Role)\
        .join(CastMember)\
        .add_column(CastMember.gender)\
        .all()
    seasons = {}
    for role, gender in all_roles:
        if role.season not in seasons:
            seasons[role.season] = {
                "repertory": {
                    "male": 0,
                    "female": 0
                },
                "featured": {
                    "male": 0,
                    "female": 0
                }
            }
        if role.repertory:
            seasons[role.season]["repertory"][gender] += 1
        else:
            seasons[role.season]["featured"][gender] += 1

    for season in seasons.values():
        season["male"] = season["repertory"]["male"] + season["featured"]["male"]
        season["female"] = season["repertory"]["female"] + season["featured"]["female"]
        season["total_cast"] = season["male"] + season["female"]
    return seasons


def episodes_per_season(session):
    """
    a list of episodes per season (each value is a tuple of the season # and the # of episodes)
    """
    seasons = session.query(Episode.season, func.count(Episode.season))\
        .group_by(Episode.season)\
        .all()
    return seasons

"""
Cast Member Queries
"""


def all_cast_members(session):
    cast_members = {}
    for member in session.query(CastMember).all():
        cast_members[member.name] = {
            "name": member.name,
            "id": member.id,
            "gender": member.gender
        }
    return cast_members


def cast_member_role_seasons(session):
    """
    determine which seasons an actor was a repertory cast member and which they were
    a featured player in
    """
    all_roles = session.query(CastMember, Role)\
        .filter(CastMember.id == Role.cast_member_id)\
        .all()
    cast_members = {}
    for (cast_member, role) in all_roles:
        name = cast_member.name
        if name not in cast_members:
            cast_members[name] = {
                "repertory": [],
                "featured": []
            }
        if role.repertory:
            cast_members[name]["repertory"].append(role.season)
        else:
            cast_members[name]["featured"].append(role.season)
    return cast_members


def starting_age(session):
    """
    for each cast member, determine their age during the episode that they have
    their first credited appearance during
    returns a list sorted based on age of the cast member at the first episode
    """
    first_credits = session.query(func.min(Credit.episode_id))\
        .join(CastMember)\
        .join(Episode)\
        .add_columns(CastMember.name, CastMember.dob, Episode.air_date)\
        .group_by(Credit.cast_member_id)

    ages_at_first_credit = []
    for credit in first_credits.all():
        # episode id, name, dob, air_date
        episode_id, name, dob, air_date = credit
        if dob is None:
            continue
        age = (air_date - dob).days
        ages_at_first_credit.append((name, age, dob, air_date))
    sorted_ages = sorted(ages_at_first_credit, key=lambda t: t[1])
    return sorted_ages


def ending_age(session, current_season):
    """
    for each cast member, determine their age during the psisode that they have
    their last credited appearance during (this will include current actors, so
    this won't necessarily actually be their ending age)
    """
    first_credits = session.query(func.max(Credit.episode_id))\
        .join(CastMember)\
        .join(Episode)\
        .add_columns(CastMember.name, CastMember.dob, Episode.air_date, Episode.season)\
        .group_by(Credit.cast_member_id)

    ages_at_last_credit = []
    for credit in first_credits.all():
        # episode id, name, dob, air_date, season
        episode_id, name, dob, air_date, season = credit
        # skip if the cast member has no known birthdate or their last credit
        # is in the most current season
        if dob is None or season == current_season:
            continue
        age = (air_date - dob).days
        ages_at_last_credit.append((name, age, dob, air_date))
    sorted_ages = sorted(ages_at_last_credit, key=lambda t: t[1])
    return sorted_ages


def total_credits(session):
    """
    for each cast member, determine the number of episodes that they are credited
    as appearing in
    """
    return session.query(func.count(Credit.cast_member_id))\
        .join(CastMember)\
        .add_column(CastMember.name)\
        .group_by(Credit.cast_member_id)\
        .all()
