
from pathlib import Path
from flask import g
import psycopg2
import os 
from dotenv import load_dotenv


load_dotenv()
CURRENT_DIR = Path(__file__).parent
DB_PATH = CURRENT_DIR / "sql" / "schema.sql"


def get_db() -> psycopg2.extensions.connection:
    """Connect to the PostgreSQL database, and return the connection object"""
    if 'db' not in g:
        g.db = psycopg2.connect(dbname=os.getenv("DB_NAME", "default_db_name"),
                                user=os.getenv("DB_USER", "default_user"),
                                password=os.getenv("DB_PASSWORD", "default_password"),
                                host=os.getenv("DB_HOST", "localhost"),
                                port=os.getenv("DB_PORT", "5432"))
    return g.db


def close_db(_e=None) -> None:
    """Close the connection to the PostgreSQL database"""
    db = g.pop('db', None)
    if db is not None:
        db.close()


