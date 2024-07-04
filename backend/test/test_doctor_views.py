
from datetime import datetime

import pytest
from flask import json

from db.db import get_db
from main import app

@pytest.fixture
def setup_teardown_db():
    with app.app_context():
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM appointments WHERE doctor_id = 999")
        cursor.execute("DELETE FROM doctors WHERE doctor_id = 999")
        cursor.execute("DELETE FROM users WHERE id = 999")
        cursor.execute("DELETE FROM appointments WHERE patient_id = 888")
        cursor.execute("DELETE FROM patients WHERE patient_id = 888")
        cursor.execute("DELETE FROM users WHERE id = 888")
        cursor.execute("DELETE FROM appointments WHERE doctor_id = 999")

        conn.commit()
        yield cursor
        conn.rollback()

@pytest.fixture(scope="module", autouse=True)
def cleanup_db():
    yield
    with app.app_context():
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM appointments WHERE doctor_id = 999")
        cursor.execute("DELETE FROM doctors WHERE doctor_id = 999")
        cursor.execute("DELETE FROM users WHERE id = 999")
        cursor.execute("DELETE FROM appointments WHERE patient_id = 888")
        cursor.execute("DELETE FROM patients WHERE patient_id = 888")
        cursor.execute("DELETE FROM users WHERE id = 888")
        cursor.execute("DELETE FROM appointments WHERE doctor_id = 999")
        conn.commit()


def test_get_specialties(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db
    
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Cardiologist'))

    response = client.get('/get_specialties')
    
    assert response.status_code == 200
    assert isinstance(response.json, dict)
    
    actual_specialties = response.json['specialties']
    expected_specialty = 'Cardiologist'
    
    # Ensure at least one 'Cardiologist' in the specialties list
    assert any(expected_specialty in specialty for specialty in actual_specialties)
      
def test_get_doctor_by_id(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db
    
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Cardiologist'))
    
    cursor.connection.commit()

    response = client.get('/get_doctors_by_Id/999')
    
    assert response.status_code == 200
    assert isinstance(response.json, dict)
    
    actual_doctor = response.json
    expected_doctor = {
        "doctor_id": 999,
        "specialty": "Cardiologist",
        "full_name": "test_doctor_name"
    }
    
    assert actual_doctor["doctor_id"] == expected_doctor["doctor_id"]
    assert actual_doctor["specialty"] == expected_doctor["specialty"]
    assert actual_doctor["full_name"] == expected_doctor["full_name"]
def test_get_doctor_patient(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db
    
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Cardiologist'))
    

    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (888, 'test_username_patient', 'test_password', 'patient', 'test_patient_name'))
    cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (888, 'Gold'))
    
    cursor.execute("INSERT INTO appointments (date_time, doctor_id, status, patient_id) VALUES (%s, %s, %s, %s)", 
                   ('2024-06-17T19:46:07', 999, 'schedule', 888))

    cursor.connection.commit()

    response = client.get('/get_doctor_patients/999')

    assert response.status_code == 200
    assert isinstance(response.json, list)

    actual_patients = response.json
    expected_patient = {
        "patient_id": 888,
        "username": "test_username_patient",  
        "full_name": "test_patient_name",
    }

    # Ensure the expected patient is in the list of actual patients
    assert any(patient['patient_id'] == expected_patient['patient_id'] for patient in actual_patients), \
        f"Expected patient {expected_patient} not found in {actual_patients}"


def test_get_doctor_by_name(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                     (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Cardiologist'))

    cursor.connection.commit()

    response = client.get('/get_doctor/by_name/test_doctor_name')

    assert response.status_code == 200


def test_get_doctor_by_specialty(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                     (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Cardiologist'))

    cursor.connection.commit()

    response = client.get('/get_doctor/by_specialty/Cardiologist')

    assert response.status_code == 200
    
