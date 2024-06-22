from typing import List
import pytest
from unittest.mock import MagicMock, patch
from models.doctor import Doctor
import psycopg2

@pytest.fixture
def mock():
    return MagicMock()

@pytest.fixture
def mock_cursor(mock):
    mock_cursor = mock.MagicMock()
    mock_cursor.execute = mock.MagicMock()
    mock_cursor.fetchall = mock.MagicMock()
    return mock_cursor

@pytest.fixture
def doctor():
    return Doctor(username='test_user_doctor', doctor_id=1, specialty='Cardiology', password='test_pass')

def test_add_doctor_psycopg2_error(mock_cursor, doctor):
    mock_cursor.execute.side_effect = psycopg2.Error
    result = doctor.add_doctor(mock_cursor)
    assert result == False


def test_add_doctor_unexpected_error(mock_cursor, doctor):
    mock_cursor.execute.side_effect = Exception("Unexpected error")
    result = doctor.add_doctor(mock_cursor)
    assert result == False
    mock_cursor.execute.assert_called_once()
    
def test_add_doctor_success(mock_cursor, doctor):
    result = doctor.add_doctor(mock_cursor)
    assert result == True
    mock_cursor.execute.assert_called_once_with(
        """
                INSERT INTO doctors (doctor_id, specialty)
                VALUES (%s, %s)
                """,
        (1, 'Cardiology')
    )
def test_get_doctor_success(mock_cursor):
    mock_cursor.fetchone.return_value = {'username': 'testdoctor', 'full_name': 'Test Doctor', 'age': 45, 'email': 'test@hospital.com', 'phone': '1234567890'}
    result = Doctor.get_doctor(mock_cursor, 1)
    assert result is not None
    assert result['username'] == 'testdoctor'

def test_get_doctor_psycopg2_error(mock_cursor):
    mock_cursor.execute.side_effect = psycopg2.Error("Database error")
    result = Doctor.get_doctor(mock_cursor, 1)
    assert result is None

def test_get_doctor_unexpected_error(mock_cursor):
    mock_cursor.execute.side_effect = Exception("Unexpected error")
    result = Doctor.get_doctor(mock_cursor, 1)
    assert result is None

def test_get_doctor_by_specialty_success(mock_cursor):
    mock_cursor.fetchall.return_value = [
        {'doctor_id': 1, 'specialty': 'Cardiology', 'full_name': 'Dr. Doctor', 'age': 45, 'email': 'doctor@gmail.com', 'phone': '123456789'},
        {'doctor_id': 2, 'specialty': 'Cardiology', 'full_name': 'Dr. John', 'age': 50, 'email': 'john@gmail.com', 'phone': '123456789'}
    ]
    result = Doctor.get_doctor_by_specialty(mock_cursor, 'Cardiology')
    print("result",result)
    assert isinstance(result, List)
    assert len(result) == 2
    assert result[0]['full_name'] == 'Dr. Doctor'
    assert result[1]['full_name'] == 'Dr. John'

def test_get_doctor_by_specialty_psycopg2_error(mock_cursor):
    mock_cursor.execute.side_effect = psycopg2.Error("Database error")
    result = Doctor.get_doctor_by_specialty(mock_cursor, 'Cardiology')
    assert result is None

def test_get_doctor_by_specialty_unexpected_error(mock_cursor):
    mock_cursor.execute.side_effect = Exception("Unexpected error")
    result = Doctor.get_doctor_by_specialty(mock_cursor, 'Cardiology')
    assert result is None

def test_get_doctor_patients_success(mock_cursor):
    mock_cursor.fetchall.return_value = [
        {'patient_id': 1, 'full_name': 'Patient One', 'age': 30, 'email': 'patient1@example.com', 'phone': '111-222-3333'},
        {'patient_id': 2, 'full_name': 'Patient Two', 'age': 40, 'email': 'patient2@example.com', 'phone': '444-555-6666'}
    ]
    result = Doctor.get_doctor_patients(mock_cursor, 1) 
    assert isinstance(result, List)
    assert len(result) == 2
    assert result[0]['full_name'] == 'Patient One'

def test_get_doctor_patients_psycopg2_error(mock_cursor):
    mock_cursor.execute.side_effect = psycopg2.Error("Database error")
    result = Doctor.get_doctor_patients(mock_cursor, 1)
    assert result is None

def test_get_doctor_patients_unexpected_error(mock_cursor):
    mock_cursor.execute.side_effect = Exception("Unexpected error")
    result = Doctor.get_doctor_patients(mock_cursor, 1)
    assert result is None

def test_get_doctors(mock_cursor):
    mock_cursor.fetchall.return_value = [
        {'doctor_id': 1, 'specialty': 'Cardiology', 'full_name': 'Dr. Doctor', 'age': 45, 'email': 'doctor@gamil.com','phone': '123456789'},
        {'doctor_id': 2, 'specialty': 'Cardiology', 'full_name': 'Dr. John', 'age': 50, 'email': 'doctor2@gamil.com','phone': '123456789'}
    ]
    result = Doctor.get_doctors(mock_cursor)
    assert isinstance(result, List)
    assert len(result) == 2
    assert result[0]['full_name'] == 'Dr. Doctor'
