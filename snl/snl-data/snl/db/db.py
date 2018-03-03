from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .models import Base


def connect(db_path="sqlite:///:memory:", echo=False):
    """
    initialize a database and return a session to interact with it
    by default, uses an in-memory sqlite3 database
    """
    engine = create_engine(db_path, echo=echo)
    Base.metadata.create_all(engine, checkfirst=True)
    Session = sessionmaker(bind=engine)
    return Session()
