import pytest
from unittest.mock import MagicMock
from models.patient import Patient
from psycopg2 import Error, DatabaseError
from typing import List, Optional

@pytest.fixture
def mock_cursor():
    return MagicMock()

def test_add_patient_success(mock_cursor):
    patient = Patient(username="test_patient", password="password", patient_id=1, package="Silver")
    result = patient.add_patient(mock_cursor)
    print(result)
    assert result is True
    mock_cursor.execute.assert_called_once_with(
        """
        INSERT INTO patients (patient_id, package)
        VALUES (%s, %s)
        """,
        (1, "Silver")
    )

# def test_add_patient_psycopg2_error(mock_cursor):
#     patient = Patient(username="test_patient", password="password", patient_id=1, package="Silver")
#     mock_cursor.execute.side_effect = Error("Mock error")
#     result = patient.add_patient(mock_cursor)
#     assert result is False
#     mock_cursor.execute.assert_called_once_with(
#         """
#         INSERT INTO patients (patient_id, package)
#         VALUES (%s, %s)
#         """,
#         (1, "Silver")
#     )

# def test_get_patient_success(mock_cursor):
#     mock_cursor.fetchone.return_value = {
#         'patient_id': 1, 'username': 'test_patient', 'full_name': 'John Doe', 'age': 30,
#         'email': 'john.doe@example.com', 'phone': '123-456-7890'
#     }
#     result = Patient.get_patient(mock_cursor, 1)
#     assert result == {
#         'patient_id': 1, 'username': 'test_patient', 'full_name': 'John Doe', 'age': 30,
#         'email': 'john.doe@example.com', 'phone': '123-456-7890'
#     }
#     mock_cursor.execute.assert_called_once_with("""
#         SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone
#         FROM patients p
#         INNER JOIN users u ON u.id = p.patient_id
#         WHERE u.id = %s;
#     """, (1,))

# def test_get_patient_not_found(mock_cursor):
#     mock_cursor.fetchone.return_value = None
#     result = Patient.get_patient(mock_cursor, 1)
#     assert result is None
#     mock_cursor.execute.assert_called_once_with("""
#         SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone
#         FROM patients p
#         INNER JOIN users u ON u.id = p.patient_id
#         WHERE u.id = %s;
#     """, (1,))

# def test_get_patient_doctors_success(mock_cursor):
#     expected_doctors = [
#         {'doctor_id': 1, 'specialty': 'Cardiology', 'username': 'doc1', 'full_name': 'Dr. John Doe', 'age': 45, 'email': 'john.doe@example.com', 'phone': '123-456-7890'},
#         {'doctor_id': 2, 'specialty': 'Dermatology', 'username': 'doc2', 'full_name': 'Dr. Jane Smith', 'age': 50, 'email': 'jane.smith@example.com', 'phone': '987-654-3210'}
#     ]
#     mock_cursor.fetchall.return_value = expected_doctors
#     result = Patient.get_patient_doctors(mock_cursor, 1)
#     assert result == expected_doctors
#     mock_cursor.execute.assert_called_once_with("""
#         SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
#         FROM doctors d
#         INNER JOIN users u ON u.id = d.doctor_id
#         INNER JOIN appointments a ON a.doctor_id = d.doctor_id
#         WHERE a.patient_id = %s;
#     """, (1,))

# def test_get_patient_doctors_error(mock_cursor):
#     mock_cursor.execute.side_effect = Error("Mock error")
#     result = Patient.get_patient_doctors(mock_cursor, 1)
#     assert result is None
#     mock_cursor.execute.assert_called_once_with("""
#         SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
#         FROM doctors d
#         INNER JOIN users u ON u.id = d.doctor_id
#         INNER JOIN appointments a ON a.doctor_id = d.doctor_id
#         WHERE a.patient_id = %s;
#     """, (1,))

# def test_get_all_patients_success(mock_cursor):
#     expected_patients = [
#         {'patient_id': 1, 'username': 'patient1', 'full_name': 'John Doe', 'age': 30, 'email': 'john.doe@example.com', 'phone': '123-456-7890'},
#         {'patient_id': 2, 'username': 'patient2', 'full_name': 'Jane Smith', 'age': 35, 'email': 'jane.smith@example.com', 'phone': '987-654-3210'}
#     ]
#     mock_cursor.fetchall.return_value = expected_patients
#     result = Patient.get_all_patients(mock_cursor)
#     assert result == expected_patients
#     mock_cursor.execute.assert_called_once_with("""
#         SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone
#         FROM patients p
#         INNER JOIN users u ON u.id = p.patient_id;
#     """)
