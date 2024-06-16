import pytest
from unittest.mock import patch, MagicMock
from main import app
from flask import jsonify
from datetime import datetime

# Fixture for Flask test client
@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


@pytest.fixture
def mock_db():
    with patch('main.get_db') as mock_get_db:
        mock_db_instance = MagicMock()

        # Mock cursor and its methods
        mock_cursor = MagicMock()
        mock_cursor.__enter__.return_value = mock_cursor
        mock_db_instance.cursor.return_value = mock_cursor

        # Mock begin and rollback methods
        mock_db_instance.begin = MagicMock()
        mock_db_instance.rollback = MagicMock()

        mock_get_db.return_value = mock_db_instance

        yield mock_db_instance

        mock_db_instance.rollback()


def test_add_appointment(client):
    response = client.post("/add_appointment", json={
        "doctor_id": 1, 
        "datetime": "2023-01-01T09:00:00"
    })

    assert response.status_code == 200, "Expected status code 200, got {}".format(response.status_code)

    response_data = response.get_json()
    assert 'message' in response_data and response_data['message'] == 'Appointment added successfully', \
        "Response message not as expected"
    assert 'appointment_id' in response_data, "Response does not contain appointment_id"



def test_check_appointment(client, mock_db):
    response = client.get("/check_appointment", query_string={"datetime": datetime.now().isoformat(), "doctor_id": 3})
    assert response.status_code == 200
    assert 'exists' in response.json

def test_get_appointments(client, mock_db):
    doctor_id = 3
    response = client.get(f"/get_appointments/{doctor_id}")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_schedule_appointment(client, mock_db):
    appointment_id = 10
    patient_id = 2
    response = client.post(f"/schedule_appointment/{appointment_id}/{patient_id}")
    assert response.status_code == 200
    assert response.json == {'message': "Appointment scheduled successfully."}

def test_get_appointments_by_patient_id(client, mock_db):
    patient_id = 2
    response = client.get(f"/get_appointments_by_patient_id/{patient_id}")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_cancel_appointment(client, mock_db):
    appointment_id = 1
    response = client.post(f"/cancel_appointment/{appointment_id}")
    assert response.status_code == 200
    assert response.json == {'message': "Appointment cancelled successfully."}

def test_get_history_patient_appointments(client, mock_db):
    patient_id = 2
    response = client.get(f"/history_patient_appointments/{patient_id}")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_add_summary(client, mock_db):
    appointment_id = 10
    patient_id = 2
    data = {
        "summary": "Appointment Summary",
        "written_diagnosis": "Diagnosis",
        "written_prescription": "Prescription"
    }
    response = client.post(f"/add_summary/{appointment_id}/{patient_id}", json=data)
    assert response.status_code == 200
    assert response.json == {"message": "Form data received and processed successfully"}

def test_get_appointments_history(client, mock_db):
    doctor_id = 1
    response = client.get(f"/get_appointments_history/{doctor_id}")
    assert response.status_code == 200
    assert isinstance(response.json, list)

def test_get_appointment_by_id(client, mock_db):
    appointment_id = 1
    response = client.get(f"/get_appointment_by_id/{appointment_id}")
    
    assert response.status_code == 200
    
    # Check if response.json is None (or null in JSON) when no appointment is found
    if response.json is None:
        assert response.json is None
    else:
        assert isinstance(response.json, dict)


def test_get_all_appt(client, mock_db):
    response = client.get("/get_all_appt")
    assert response.status_code == 200
    assert isinstance(response.json, list)
