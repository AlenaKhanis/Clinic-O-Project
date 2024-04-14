
from pathlib import Path
from flask import g
import psycopg2

CURRENT_DIR = Path(__file__).parent
DB_PATH = CURRENT_DIR / "sql" / "schema.sql"


def get_db() -> psycopg2.extensions.connection:
    """Connect to the PostgreSQL database, and return the connection object"""
    if 'db' not in g:
        g.db = psycopg2.connect(dbname="postgres",
                                user="postgres",
                                password="data445566",
                                host="localhost",
                                port="5432")
    return g.db


def close_db(_e=None) -> None:
    """Close the connection to the PostgreSQL database"""
    db = g.pop('db', None)
    if db is not None:
        db.close()


