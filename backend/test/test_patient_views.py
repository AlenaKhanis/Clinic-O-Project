
from datetime import datetime

import pytest
from flask import json

from db.db import get_db
from main import app

appt = ['2024-06-17T19:46:07.067892', 999]

#Used to prepare the database state before running each test that requires a clean state.
#After each test, ensures that any changes made during the test are rolled back, reverting the database to its initial state.
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

        conn.commit()
        yield cursor
        conn.rollback()
        
#This fixture ensures that the database is cleaned up after all tests
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
        conn.commit()

def test_get_patient_by_id(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (888, 'test_username_patient', 'test_password', 'patient', 'test_patient_name'))
    cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (888, 'Gold'))

    response = client.get('/get_patient_by_id/888')

    assert response.status_code == 200
    assert isinstance(response.json, dict)
    assert response.json['patient_id'] == 888

def test_get_patient_doctors(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Cardiology'))
    cursor.execute("INSERT INTO appointments (appointment_id, doctor_id, patient_id, date, time) VALUES (%s, %s, %s, %s, %s)",
                   (999, 999, 888, appt[0], appt[1]))

    response = client.get('/get_patient_doctors/888')

    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert response.json[0]['doctor_id'] == 999    

def test_get_all_patients(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                     (888, 'test_username_patient', 'test_password', 'patient', 'test_patient_name'))
    cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (888, 'Gold'))

    response = client.get('/get_patients')

    assert response.status_code == 200

    assert isinstance(response.json, list)
    assert response.json[0]['patient_id'] == 888
    assert response.json[0]['package'] == 'Gold'
    assert response.json[0]['full_name'] == 'test_patient_name'
    assert response.json[0]['role'] == 'patient'
    assert response.json[0]['username'] == 'test_username_patient'
    assert response.json[0]['password'] == 'test_password'

        
