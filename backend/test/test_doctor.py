import os
from unittest.mock import MagicMock

import psycopg2
import pytest
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

from models.doctor import Doctor

load_dotenv()

@pytest.fixture(scope="function")
def db_cursor(request):
    # Connect to the test database
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    conn.autocommit = True
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Cleanup function
    def cleanup():
        try:
            cursor.execute("DELETE FROM patients WHERE patient_id IN (999, 888)")
            cursor.execute("DELETE FROM users WHERE id IN (999, 888)")
            cursor.execute("DELETE FROM doctors WHERE doctor_id = 888")
            cursor.execute("DELETE FROM appointments WHERE id = 101")
        except psycopg2.Error as e:
            print(f"Error during cleanup: {e}")
        except Exception as e:
            print(f"Unexpected error during cleanup: {e}")
        finally:
            cursor.close()
            conn.close()
    
    request.addfinalizer(cleanup)
    yield cursor 
    


@pytest.fixture
def doctor():
    return Doctor(username='test_user_doctor', doctor_id=888, specialty='Cardiology', password='test_pass')

def test_add_doctor(db_cursor, doctor):
    db_cursor.execute("""
                      INSERT INTO users (id, username, password, full_name, role)
                       VALUES (888, 'test_user_doctor', 'test_pass', 'doctor name', 'doctor')
                      """)

    result = doctor.add_doctor(db_cursor)
    assert result is True

    db_cursor.execute("SELECT * FROM doctors WHERE doctor_id = %s", (888,))
    inserted_doctor = db_cursor.fetchone()
    assert inserted_doctor is not None
    assert inserted_doctor['doctor_id'] == 888
    assert inserted_doctor['specialty'] == 'Cardiology'


def test_get_doctor(db_cursor):
    db_cursor.execute("""
                      INSERT INTO users (id, username, password, full_name, role)
                       VALUES (888, 'test_user_doctor', 'test_pass', 'doctor name', 'doctor')
                      """)
    db_cursor.execute("""
                      INSERT INTO doctors (doctor_id, specialty)
                       VALUES (888, 'Cardiology')
                      """)
 
    doctor_data = Doctor.get_doctor(db_cursor, 888)
    assert doctor_data is not None
    assert doctor_data['doctor_id'] == 888
    assert doctor_data['specialty'] == 'Cardiology'

def test_get_doctor_by_specialty(db_cursor, doctor):
    db_cursor.execute("""
                      INSERT INTO users (id, username, password, full_name, role)
                       VALUES (888, 'test_user_doctor', 'test_pass', 'doctor name', 'doctor')
                      """)
    db_cursor.execute("""
                      INSERT INTO doctors (doctor_id, specialty)
                       VALUES (888, 'Cardiology')
                      """)
   
    doctors_data = Doctor.get_doctor_by_specialty(db_cursor, 'Cardiology')
    assert doctors_data is not None
    assert len(doctors_data) == 1
    assert doctors_data[0]['doctor_id'] == 888
    assert doctors_data[0]['specialty'] == 'Cardiology'

def test_get_doctor_patients(db_cursor, doctor):
    db_cursor.execute("""
                      INSERT INTO users (id, username, password, full_name, role)
                       VALUES (888, 'test_user_doctor', 'test_pass', 'doctor name', 'doctor')
                      """)
    db_cursor.execute("""
                      INSERT INTO users (id, username, password, full_name, role)
                          VALUES (999, 'test_user_patient', 'test_pass', 'patient name', 'patient')
                         """)
    db_cursor.execute("""
                      INSERT INTO patients (patient_id)
                       VALUES (999)
                      """)
    db_cursor.execute("""
                        INSERT INTO doctors (doctor_id, specialty)
                        VALUES (888, 'Cardiology')
                        """)
    db_cursor.execute("""INSERT INTO appointments (id, patient_id, doctor_id, date_time, status)
                        VALUES (101, 999, 888, '2022-01-01 10:00:00 ', 'completed')""")
 
    patients = doctor.get_doctor_patients(db_cursor, 888)
    assert patients[0]['patient_id'] == 999
    assert patients[0]['full_name'] == 'patient name'
    
    
def test_get_doctor_patient_none(db_cursor, doctor):
    db_cursor.execute("""
                      INSERT INTO users (id, username, password, full_name, role)
                       VALUES (888, 'test_user_doctor', 'test_pass', 'doctor name', 'doctor')
                      """)
    db_cursor.execute("""
                      INSERT INTO users (id, username, password, full_name, role)
                          VALUES (999, 'test_user_patient', 'test_pass', 'patient name', 'patient')
                         """)
    db_cursor.execute("""
                      INSERT INTO patients (patient_id)
                       VALUES (999)
                      """)
    db_cursor.execute("""
                        INSERT INTO doctors (doctor_id, specialty)
                        VALUES (888, 'Cardiology')
                        """)
 
    patients = doctor.get_doctor_patients(db_cursor, 999)
    assert patients == []
    
def test_get_doctor_by_name(db_cursor):
    db_cursor.execute("""
                      INSERT INTO users (id, username, password, full_name, role)
                       VALUES (888, 'test_user_doctor', 'test_pass', 'Doctor Name', 'doctor')
                      """)
    db_cursor.execute("""
                      INSERT INTO doctors (doctor_id, specialty)
                       VALUES (888, 'Cardiology')
                      """)

    doctor_data = Doctor.get_doctor_by_name(db_cursor, 'Doctor Name')
    
    assert doctor_data is not None
    assert len(doctor_data) == 1
    assert doctor_data[0]['doctor_id'] == 888
    assert doctor_data[0]['specialty'] == 'Cardiology'
    assert doctor_data[0]['full_name'] == 'Doctor Name'


def test_get_doctors():

    db_cursor = MagicMock()
    db_cursor.execute = MagicMock()

    db_cursor.fetchall = MagicMock(return_value=[
        {
            'doctor_id': 888,
            'specialty': 'Cardiology',
            'full_name': 'doctor name',
            'age': 45,
            'email': 'doctor@example.com',
            'phone': '1234567890'
        }
    ])

    doctors_data = Doctor.get_doctors(db_cursor)

    assert doctors_data is not None
    assert len(doctors_data) == 1
    assert doctors_data[0]['doctor_id'] == 888
    assert doctors_data[0]['specialty'] == 'Cardiology'
    assert doctors_data[0]['full_name'] == 'doctor name'
    assert doctors_data[0]['age'] == 45
    assert doctors_data[0]['email'] == 'doctor@example.com'
    assert doctors_data[0]['phone'] == '1234567890'