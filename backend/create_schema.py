# from pathlib import Path
# import psycopg2

# CURRENT_DIR = Path(__file__).parent
# DB_PATH = CURRENT_DIR / "sql" / "schema.sql"

# def create_schema():
#     try:
#         db = psycopg2.connect(
#             dbname="postgres",
#             user="postgres",
#             password="data445566",
#             host="localhost",
#             port="5432"
#         )

#         cursor = db.cursor()
#         db_schema = DB_PATH.read_text()
#         cursor.execute(db_schema)
#         db.commit()

#         print("Database created successfully........")

#     except Exception as e:
#         print("Error creating database:", e)

#     finally:
#         cursor.close()
#         db.close()

# if __name__ == "__main__":
#     create_schema()


from pathlib import Path
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Path to SQL schema file
CURRENT_DIR = Path(__file__).parent
DB_PATH = CURRENT_DIR / "sql" / "schema.sql"

def create_schema():
    try:
        db = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST"),
            port=os.getenv("DB_PORT")
        )

        cursor = db.cursor()
        db_schema = DB_PATH.read_text()
        cursor.execute(db_schema)
        db.commit()

        print("Database created successfully........")

    except Exception as e:
        print("Error creating database:", e)

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'db' in locals():
            db.close()

if __name__ == "__main__":
    create_schema()
