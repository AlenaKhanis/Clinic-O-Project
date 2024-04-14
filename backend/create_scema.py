from pathlib import Path
import psycopg2

CURRENT_DIR = Path(__file__).parent
DB_PATH = CURRENT_DIR / "sql" / "schema.sql"


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

cursor.close()
db.close()
