from pathlib import Path
import psycopg2
from dotenv import load_dotenv
import os


load_dotenv()


CURRENT_DIR = Path(__file__).parent
SCHEMA_PATH = CURRENT_DIR / "../sql/schema.sql"
DATA_PATH = CURRENT_DIR / "../sql/example.sql"

def run_sql_file(db, file_path):
    with file_path.open() as file:
        sql = file.read()
        with db.cursor() as cursor:
            cursor.execute(sql)
            db.commit()

def create_schema_and_load_data():
    try:
        db = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )

        run_sql_file(db, SCHEMA_PATH)
        print("Schema created successfully.")

        run_sql_file(db, DATA_PATH)
        print("Data loaded successfully.")

    except Exception as e:
        print("Error creating schema or loading data:", e)

    finally:
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    create_schema_and_load_data()
