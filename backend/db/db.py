
import os

import psycopg2
from flask import g


def get_db():
    if "db" not in g:
        DB_HOST = os.getenv("DB_HOST")
        DB_PORT = int(os.getenv("DB_PORT"))
        DB_NAME = os.getenv("DB_NAME")
        DB_USER = os.getenv("DB_USER")
        DB_PASS = os.getenv("DB_PASSWORD")

        try:
            g.db = psycopg2.connect(
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASS,
                host=DB_HOST,
                port=DB_PORT,
            )
        except psycopg2.OperationalError as e:
            raise e  

    return g.db

def close_db(_e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()
