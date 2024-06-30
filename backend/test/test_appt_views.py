
from datetime import datetime

import pytest
from flask import json

from db.db import get_db
from main import app

appt = ['2024-06-17T19:46:07.067892', 999]

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

def test_check_appointment_exists(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    # Insert a new user 
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))

    # Insert a new doctor 
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Some'))

    # Insert an appointment for the created doctor
    cursor.execute("INSERT INTO appointments (date_time, doctor_id, status) VALUES (%s, %s, %s)", 
                   (appt[0], appt[1], 'open'))

    # Check if the appointment exists
    response = client.get("/check_appointment", query_string={"datetime": appt[0], "doctor_id": appt[1]})
    assert response.status_code == 200
    assert isinstance(response.json, dict)
    assert "exists" in response.json
    assert response.json["exists"] == True

def test_check_appointment_not_exists(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    # Insert a new user 
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))

    # Insert a new doctor 
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Some'))

    # Check if the appointment exists
    response = client.get("/check_appointment", query_string={"datetime": '2024-06-17T19:46:07.067892', "doctor_id": 999})
    assert response.status_code == 200
    assert isinstance(response.json, dict)
    assert "exists" in response.json
    assert response.json["exists"] == False

def test_add_appointment(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    # Insert a new user 
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))

    # Insert a new doctor 
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Some'))

    # Add a new appointment
    response = client.post("/add_appointment", json={"doctor_id": 999, "datetime": '2024-06-17T19:46:07.067892'})
    assert response.status_code == 200
    assert isinstance(response.json, dict)
    assert "message" in response.json
    assert response.json["message"] == "Appointment added successfully"

    # Check if the appointment was added
    cursor.execute("SELECT * FROM appointments WHERE doctor_id = 999")
    appointment = cursor.fetchone()
    assert appointment is not None
    assert appointment[2] == datetime.fromisoformat('2024-06-17T19:46:07.067892')
    assert appointment[4] == 999
    assert appointment[3] == 'open'

def test_get_appointments_existing_doctor(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    # Insert a new user
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))

    # Insert a new doctor
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Some'))

    # Insert an appointment for the created doctor
    cursor.execute("INSERT INTO appointments (date_time, doctor_id, status) VALUES (%s, %s, %s)", 
                   ('2024-06-17T19:46:07', 999, 'open'))

    # Get the appointments
    response = client.get(f"/get_appointments/{999}")
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 1

    # Convert date_time string from response to datetime object for comparison

    original_datetime_str = 'Mon, 17 Jun 2024 19:46:07 GMT'

    # Parse the original datetime string
    original_datetime = datetime.strptime(original_datetime_str, '%a, %d %b %Y %H:%M:%S %Z')

    # Convert expected ISO format datetime string to datetime object
    expected_datetime = datetime.fromisoformat('2024-06-17T19:46:07')

    # Assert that the parsed response datetime matches the expected datetime
    assert original_datetime == expected_datetime
    assert response.json[0]["doctor_id"] == 999
    assert response.json[0]["status"] == 'open'

def test_get_appointments_non_existing_doctor(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    # Insert a new user
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))

    # Insert a new doctor
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Some'))

    # Get the appointments for a doctor that does not exist
    response = client.get(f"/get_appointments/{888}")
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) == 0  # Expecting an empty list for non-existing doctor


def test_schedule_appointment_already_scheduled(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    appointment_id = 777
    patient_id = 888

   # Insert a new user
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (patient_id, 'test_username_patien', 'test_password', 'patient', 'test_patient_name'))

    # Insert a new doctor
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Some'))
    cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (patient_id, 'Gold'))

    # Insert an appointment for the created doctor
    cursor.execute("INSERT INTO appointments (id ,date_time, doctor_id, status) VALUES ( %s ,%s, %s, %s)", 
                   (777,'2024-06-17T19:46:07', 999, 'schedule'))

    # Attempt to schedule the appointment again
    response = client.post(f"/schedule_appointment/{appointment_id}/{patient_id}")

    # Assert the expected response status code and error message
    assert response.status_code == 400
    assert "error" in json.loads(response.data)
    assert response.json["error"] == "Appointment is already scheduled."

def test_schedule_appointment_completed(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    appointment_id = 777
    patient_id = 888

   # Insert a new user
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (patient_id, 'test_username_patien', 'test_password', 'patient', 'test_patient_name'))

    # Insert a new doctor
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Some'))
    cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (patient_id, 'Gold'))

    # Insert an appointment for the created doctor
    cursor.execute("INSERT INTO appointments (id ,date_time, doctor_id, status) VALUES ( %s ,%s, %s, %s)", 
                   (777,'2024-06-17T19:46:07', 999, 'open'))


    response = client.post(f"/schedule_appointment/{appointment_id}/{patient_id}")

    # Assert the expected response status code and success message
    assert response.status_code == 200
    assert "message" in json.loads(response.data)
    assert response.json["message"] == "Appointment scheduled successfully."

def add_summary(setup_teardown_db):
    client = app.test_client()
    cursor = setup_teardown_db

    appointment_id = 777
    patient_id = 888

    # Insert a new user
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                   (999, 'test_username_doctor', 'test_password', 'doctor', 'test_doctor_name'))
    cursor.execute("INSERT INTO users (id, username, password, role, full_name) VALUES (%s, %s, %s, %s, %s)",
                     (patient_id, 'test_username_patien', 'test_password', 'patient', 'test_patient_name'))
    
    # Insert a new doctor
    cursor.execute("INSERT INTO doctors (doctor_id, specialty) VALUES (%s, %s)", (999, 'Some'))
    cursor.execute("INSERT INTO patients (patient_id, package) VALUES (%s, %s)", (patient_id, 'Gold'))

    # Insert an appointment for the created doctor
    cursor.execute("INSERT INTO appointments (id ,date_time, doctor_id, status) VALUES ( %s ,%s, %s, %s)", 
                   (777,'2024-06-17T19:46:07', 999, 'open'))
    
    # Add a summary to the appointment
    response = client.post(f"/add_summary/{appointment_id}/{patient_id}", json={"summary": "summary", "diagnosis": "diagnosis", "prescription": "prescription"})
    assert response.status_code == 200
    assert "message" in json.loads(response.data)
    assert response.json["message"] == "Summary added successfully."
