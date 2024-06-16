import psycopg2
import pytest
from unittest.mock import MagicMock
from datetime import datetime
from models.appointments import Appointment  

@pytest.fixture
def mock_cursor():
    return MagicMock()

def test_add_open_appointment_for_doctor(mock_cursor):
    appointment = Appointment(
        date_time=datetime(2024, 6, 20, 14, 0),
        doctor_id=1,
        status='open'
    )

    result = appointment.add_open_appointment_for_doctor(mock_cursor)
    mock_cursor.execute.assert_called_once()
    assert result is True

def test_add_open_appointment_for_doctor_integrity_error(mock_cursor):
    mock_cursor.execute.side_effect = psycopg2.IntegrityError()
    appointment = Appointment(
        date_time=datetime(2024, 6, 20, 14, 0),
        doctor_id=1,
        status='open'
    )

    result = appointment.add_open_appointment_for_doctor(mock_cursor)
    assert result is False
    mock_cursor.connection.rollback.assert_called_once()

def test_check_appointment_exists(mock_cursor):
    mock_cursor.fetchone.return_value = {'id': 1}
    appointment_datetime = datetime(2024, 6, 20, 14, 0)
    doctor_id = 1

    result = Appointment.check_appointment_exists(appointment_datetime, doctor_id, mock_cursor)
    assert result is True

def test_check_appointment_exists_not_found(mock_cursor):
    mock_cursor.fetchone.return_value = None
    appointment_datetime = datetime(2024, 6, 20, 14, 0)
    doctor_id = 1

    result = Appointment.check_appointment_exists(appointment_datetime, doctor_id, mock_cursor)
    assert result is False

def test_get_appointment_by_doctor_id(mock_cursor):
    mock_cursor.fetchall.return_value = [{'id': 1, 'doctor_id': 1, 'status': 'open'}]
    doctor_id = 1

    result = Appointment.get_appointment_by_doctor_id(mock_cursor, doctor_id)
    assert len(result) == 1
    assert result[0]['doctor_id'] == 1

def test_schedule_appointment_for_patient(mock_cursor):
    mock_cursor.fetchone.return_value = {'status': 'open'}
    appointment_id = 1
    patient_id = 1

    result = Appointment.schedule_appointment_for_patient(mock_cursor, appointment_id, patient_id)
    assert result is True
    mock_cursor.execute.assert_called()

def test_get_appointments_by_patient_id(mock_cursor):
    mock_cursor.fetchall.return_value = [{'id': 1, 'patient_id': 1}]
    patient_id = 1

    result = Appointment.get_appointments_by_patient_id(mock_cursor, patient_id)
    assert len(result) == 1
    assert result[0]['patient_id'] == 1

def test_cancel_appointment_by_patient(mock_cursor):
    appointment_id = 1

    result = Appointment.cancel_appointment_by_patient(mock_cursor, appointment_id)
    assert result is True
    mock_cursor.execute.assert_called_once()

def test_get_history_patient_appointment(mock_cursor):
    mock_cursor.fetchall.return_value = [{'id': 1, 'patient_id': 1, 'status': 'completed'}]
    patient_id = 1

    result = Appointment.get_history_patient_appointment(mock_cursor, patient_id)
    assert len(result) == 1
    assert result[0]['status'] == 'completed'

def test_add_summary(mock_cursor):
    appointment_id = 1
    patient_id = 1
    summary = 'Appointment Summary'
    diagnosis = 'Diagnosis'
    prescription = 'Prescription'

    result = Appointment.add_summary(mock_cursor, summary, diagnosis, prescription, appointment_id, patient_id)
    assert result is True
    mock_cursor.execute.assert_called()

def test_get_appointments_history(mock_cursor):
    mock_cursor.fetchall.return_value = [{'id': 1, 'doctor_id': 1, 'status': 'completed'}]
    doctor_id = 1

    result = Appointment.get_appointments_history(mock_cursor, doctor_id)
    assert len(result) == 1
    assert result[0]['status'] == 'completed'

def test_get_appointment_by_id(mock_cursor):
    mock_cursor.fetchone.return_value = {'id': 1}
    appointment_id = 1

    result = Appointment.get_appointment_by_id(mock_cursor, appointment_id)
    assert result is not None
    assert result['id'] == 1

def test_get_all_appt(mock_cursor):
    mock_cursor.fetchall.return_value = [{'id': 1}]
    
    result = Appointment.get_all_appt(mock_cursor)
    assert len(result) == 1
    assert result[0]['id'] == 1
