import os

import psycopg2
import pytest
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

from models.owner import Owner

load_dotenv()

@pytest.fixture(scope="function")
def db_cursor(request):
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    conn.autocommit = True
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    def cleanup():
        try:
            cursor.execute("DELETE FROM users WHERE id = 888")
            cursor.execute("DELETE FROM owner WHERE owner_id = 888")
        except psycopg2.Error as e:
            print(f"Error during cleanup: {e}")
        except Exception as e:
            print(f"Unexpected error during cleanup: {e}")
        finally:
            cursor.close()
            conn.close()

    request.addfinalizer(cleanup)
    yield cursor 

def test_get_owner(db_cursor):
    db_cursor.execute("""
        INSERT INTO users (id, username, full_name, age, password, role)
        VALUES (888, 'test_owner', 'Test Owner', 25, 'password', 'owner')
        """)

    db_cursor.execute("""
        INSERT INTO owner (owner_id)
        VALUES (%s)
        """, (888,))
    
    owner_data = Owner.get_owner(db_cursor, 888)
    assert owner_data["owner_id"] == 888
    assert owner_data["username"] == "test_owner"
    assert owner_data["full_name"] == "Test Owner"
    assert owner_data["age"] == 25
