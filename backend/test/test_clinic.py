import os

import psycopg2
import pytest
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

from models.clinic import \
    Clinic  # Ensure this is the correct path to your Clinic class

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
            cursor.execute("DELETE FROM clinic WHERE clinic_name in ('Test Clinic', 'Updated Clinic')")
        except psycopg2.Error as e:
            print(f"Error during cleanup: {e}")
        except Exception as e:
            print(f"Unexpected error during cleanup: {e}")
        finally:
            cursor.close()
            conn.close()

    request.addfinalizer(cleanup)
    yield cursor 


def test_update_clinic_details(db_cursor):
    db_cursor.execute("""
        INSERT INTO clinic (clinic_name, clinic_address, clinic_phone, owner_id, clinic_description, clinic_email, created_date, updated_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """, ("Test Clinic", "Test Clinic", "1234567890", 1 , "A test clinic", "clinic@some.com", "2021-01-01 00:00:00", "2021-01-01 00:00:00"))
    clinic_id = db_cursor.fetchone()["id"]


    data = {
        "clinic_name": "Updated Clinic",
        "clinic_address": "456 Updated Street",
        "clinic_phone": "0987654321",
        "clinic_description": "An updated clinic",
        "clinic_email": "clinic@some.com"
    }

    clinic_updated = Clinic.update_clinic_details(db_cursor,clinic_id, data)
    assert clinic_updated is True


    db_cursor.execute("SELECT * FROM clinic WHERE id = %s", (clinic_id,))
    clinic_data = db_cursor.fetchone()
    

    assert clinic_data["clinic_name"] == "Updated Clinic"
    assert clinic_data["clinic_address"] == "456 Updated Street"
    assert clinic_data["clinic_phone"] == "0987654321"
    assert clinic_data["clinic_description"] == "An updated clinic"
