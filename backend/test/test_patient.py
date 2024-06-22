import os
import pytest
import psycopg2
from psycopg2.extras import RealDictCursor
from models.patient import Patient
from dotenv import load_dotenv
from unittest.mock import MagicMock

load_dotenv()

@pytest.fixture()
def db_cursor():
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT")
    )
    conn.autocommit = True
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    yield cursor
    cursor.close()
    conn.close()

def cleanup(db_cursor):
    db_cursor.execute("DELETE FROM patients WHERE patient_id IN (888)")
    db_cursor.execute("DELETE FROM users WHERE id IN (999, 888)")
    db_cursor.execute("DELETE FROM doctors WHERE doctor_id = 888")
    db_cursor.execute("DELETE FROM appointments WHERE id = 101")

def test_add_patient(db_cursor):
    try:
        db_cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                          (888, 'test_username_patient', 'test_password', 'patient', 'test_patient_name'))
        patient = Patient(username="testuser", password="testpass", patient_id=888, package="Silver")
        result = patient.add_patient(db_cursor)
        print(result)
        assert result == True

        db_cursor.execute("SELECT * FROM patients WHERE patient_id = %s", (888,))
        inserted_patient = db_cursor.fetchone()
        assert inserted_patient is not None
        assert inserted_patient['patient_id'] == 888
        assert inserted_patient['package'] == "Silver"
    finally:
        cleanup(db_cursor)

def test_get_patient(db_cursor):
    try:
        db_cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                          (999, 'test_username_patient', 'test_password', 'patient', 'test_patient_name'))
        db_cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (999, "Silver"))

        patient = Patient.get_patient(db_cursor, 999)
        assert patient['patient_id'] == 999
        assert patient['package'] == "Silver"
        assert patient['username'] == 'test_username_patient'
    finally:
        cleanup(db_cursor)


def test_get_patient_doctors(db_cursor):
    try:
        db_cursor.execute("INSERT INTO users (id, username, password, role, full_name, age, email, phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                          (999, 'test_username_patient', 'test_password', 'patient', 'Patient One', 30, 'pat1@example.com', '0987654321'))
        db_cursor.execute("INSERT INTO users (id, username, password, role, full_name, age, email, phone) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                          (888, 'test_username_doctor', 'doctor_password', 'doctor', 'Doctor One', 45, 'doc1@example.com', '1234567890'))
        db_cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (888, 'Cardiology'))
        db_cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (999, "Gold"))
        db_cursor.execute("INSERT INTO appointments (id, patient_id, doctor_id, date_time, status) VALUES (%s, %s, %s, %s, %s)",
                          (101, 999, 888, '2021-12-12 12:00:00', 'completed'))

        doctors = Patient.get_patient_doctors(db_cursor, 999)

        expected_doctors = [{
            'doctor_id': 888, 
            'specialty': 'Cardiology', 
            'full_name': 'Doctor One', 
            'age': 45, 
            'email': 'doc1@example.com', 
            'phone': '1234567890'
        }]

        # Convert RealDictRow objects to regular dictionaries and remove the 'id' key
        doctors_cleaned = [{k: v for k, v in doctor.items() if k != 'id'} for doctor in doctors]

        assert doctors_cleaned == expected_doctors
    finally:
        cleanup(db_cursor)

def test_get_all_patients():
    db_cursor = MagicMock()
    db_cursor.execute = MagicMock()

    db_cursor.fetchall = MagicMock(return_value=[
        {'patient_id': 999, 'username': 'test_username_patient', 'package': 'Silver'},
        {'patient_id': 888, 'username': 'test_username_patientTWO', 'package': 'Gold'}
    ])
    
    patients = Patient.get_all_patients(db_cursor)
    
    assert len(patients) == 2
    assert patients[0]['patient_id'] == 999
    assert patients[1]['patient_id'] == 888
    assert patients[0]['package'] == 'Silver'
    assert patients[1]['package'] == 'Gold'
