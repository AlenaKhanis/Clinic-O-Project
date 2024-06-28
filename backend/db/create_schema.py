import logging
from db.db import get_db
from pathlib import Path


CURRENT_DIR = Path(__file__).resolve().parent
SQL_DIR = CURRENT_DIR.parent / 'sql'

SCHEMA_PATH = SQL_DIR / 'schema.sql'
DATA_PATH = SQL_DIR / 'example.sql'

def run_sql_file(db, file_path):
    try:
        with db.cursor() as cursor:
            with file_path.open() as file:
                sql = file.read()
                cursor.execute(sql)
            db.commit()
    except Exception as e:
        db.rollback()
        logging.error(f"Error running SQL file {file_path}: {e}")
        raise

def table_exists(cursor, table_name):
    cursor.execute("""
        SELECT EXISTS (
            SELECT 1
            FROM   information_schema.tables 
            WHERE  table_schema = 'public'
            AND    table_name = %s
        )
    """, (table_name,))
    return cursor.fetchone()[0]

def create_schema_and_load_data():
    db = get_db()
    try:
        with db.cursor() as cursor:
            if not table_exists(cursor, 'users'): 
                run_sql_file(db, SCHEMA_PATH)
                logging.info("Schema created successfully.")
                run_sql_file(db, DATA_PATH)
                logging.info("Example data loaded successfully.")
            else:
                logging.info("Tables already exist, skipping creation")
                
    except Exception as e:
        logging.error(f"Error creating schema or loading data: {e}")
        db.rollback()
        raise
    finally:
        db.close()
