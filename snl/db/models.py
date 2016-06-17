from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (Column, ForeignKey,
                        Integer, String, Date, Boolean)
from sqlalchemy.orm import relationship

# The Base is created here so that it is aware of all of the tables
# without having to import them when the engine is created.
Base = declarative_base()


class CastMember(Base):
    """
    A CastMember is someone who was a member of the
    cast of Saturday Night Live, either as a regular
    cast member or as a featured player (or as both).
    """
    __tablename__ = "cast_members"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    dob = Column(Date, nullable=True)
    hometown = Column(String(100), nullable=True)
    gender = Column(String(10), nullable=True)

    def __repr__(self):
        return "<CastMember(name={}, dob={}, hometown={}, gender={})>".format(
               self.name, self.dob, self.hometown, self.gender)


class Episode(Base):
    """
    An Episode is a specific episode of the show. It belongs
    to a certain season, has an enumerated episode number within
    the season, and has an original air date.
    """
    __tablename__ = "episodes"

    id = Column(Integer, primary_key=True)
    air_date = Column(Date)
    season = Column(Integer)
    episode = Column(Integer)

    def __repr__(self):
        return "<Episode(air_date={}, season={}, episode={})>".format(
               self.air_date, self.season, self.episode)


class Role(Base):
    """
    A Role is the role for a given cast member in a given season.
    If repertory is True the actor was a "repertory" cast member, otherwise
    he/she was a "featured player".
    """
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    cast_member_id = Column(Integer, ForeignKey("cast_members.id"))
    season = Column(Integer)
    repertory = Column(Boolean)

    cast_member = relationship(CastMember, backref="roles")

    def __repr__(self):
        return "<Role(cast_member_id={}, season={}, repertory={})>".format(
               self.cast_member_id, self.season, self.repertory)


class Credit(Base):
    """
    A credit is given to a cast member for appearing in an episode.
    """
    __tablename__ = "credits"

    cast_member_id = Column(Integer, ForeignKey("cast_members.id"), primary_key=True)
    episode_id = Column(Integer, ForeignKey("episodes.id"), primary_key=True)

    cast_member = relationship(CastMember, backref="credits")
    episode = relationship(Episode, backref="credits")

    def __repr__(self):
        return "<Credit(cast_member_id={}, episode_id={})>".format(
               self.cast_member_id, self.episode_id)
