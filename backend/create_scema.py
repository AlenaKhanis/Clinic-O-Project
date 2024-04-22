from pathlib import Path
import psycopg2

CURRENT_DIR = Path(__file__).parent
DB_PATH = CURRENT_DIR / "sql" / "schema.sql"

def create_schema():
    try:
        db = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="data445566",
            host="localhost",
            port="5432"
        )

        cursor = db.cursor()
        db_schema = DB_PATH.read_text()
        cursor.execute(db_schema)
        db.commit()

        print("Database created successfully........")

    except Exception as e:
        print("Error creating database:", e)

    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    create_schema()
