from datetime import datetime
import os
from unittest.mock import MagicMock
import pytest
import psycopg2
from psycopg2.extras import RealDictCursor
from models.appointments import Appointment
from dotenv import load_dotenv

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

user_insert_for_doctor =  """
                INSERT INTO users (id, username, password, full_name, role)
                VALUES (888, 'test_user_doctor', 'test_pass', 'doctor name', 'doctor')
                """  
user_insert_for_patient = """INSERT INTO users (id, username, password, full_name, role)
                VALUES (999, 'test_user_patient', 'test_pass', 'patient name', 'patient')
                """  
doctor_insert = """
                INSERT INTO doctors (doctor_id, specialty)
                VALUES (888, 'Cardiology')
                """ 
appt_insert = """
        INSERT INTO appointments (id, doctor_id, date_time, status)
        VALUES (101, 888, '2021-12-31 12:00:00', 'open')
    """
patient_insert = """
                INSERT INTO patients (patient_id, package)
                VALUES (999, 'Gold')
                """
@pytest.fixture
def appointment():
    return Appointment(doctor_id=888, date_time='2021-12-31 12:00:00', status='open')

def test_add_open_appointment_for_doctor(db_cursor, appointment):

    db_cursor.execute(user_insert_for_doctor )
    db_cursor.execute(doctor_insert)

    result = appointment.add_open_appointment_for_doctor(db_cursor)
    assert result == True

    db_cursor.execute("SELECT * FROM appointments WHERE doctor_id = 888 AND date_time = '2021-12-31 12:00:00' AND status = 'open'")
    inserted_appointment = db_cursor.fetchone()
    assert inserted_appointment is not None, "No appointment found"
    assert inserted_appointment["doctor_id"] == 888
    assert inserted_appointment['date_time'] == datetime(2021, 12, 31, 12, 0, 0)
    assert inserted_appointment["status"] == 'open'

def test_check_appointment_exists(db_cursor, appointment):
    db_cursor.execute(user_insert_for_doctor )
    db_cursor.execute(doctor_insert)
    appointment.add_open_appointment_for_doctor(db_cursor)
    result = appointment.check_appointment_exists(datetime(2021, 12, 31, 12, 0, 0), 888 ,db_cursor)
    assert result == True
    
    db_cursor.execute("SELECT * FROM appointments WHERE doctor_id = 888 AND date_time = '2021-12-31 12:00:00' AND status = 'open'")
    inserted_appointment = db_cursor.fetchone()
    assert inserted_appointment['doctor_id'] == 888
    assert inserted_appointment['date_time'] == datetime(2021, 12, 31, 12, 0, 0)

def test_get_appointment_by_doctor_id(db_cursor, appointment):
    db_cursor.execute(user_insert_for_doctor )
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    result = appointment.get_appointment_by_doctor_id(db_cursor ,888)
    assert result is not None
    assert result[0]['doctor_id'] == 888
    assert result[0]['date_time'] == datetime(2021, 12, 31, 12, 0, 0)
    assert result[0]['status'] == 'open'

def test_get_appointment_by_doctor_id_error(db_cursor, appointment):
    db_cursor.execute(user_insert_for_doctor )
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    result = appointment.get_appointment_by_doctor_id(db_cursor ,999)
    assert result == []

def test_schedule_appointment_for_patient(db_cursor, appointment):
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    
    result = appointment.schedule_appointment_for_patient(db_cursor, 101, 999)
    assert result is True

    db_cursor.execute("SELECT * FROM appointments WHERE id = 101")
    appointment_data = db_cursor.fetchone()

    assert appointment_data['status'] == 'schedule'
    assert appointment_data['patient_id'] == 999
    # Get current datetime without microseconds
    expected_updated_date = datetime.now().replace(microsecond=0)
    # Truncate microseconds from fetched appointment's updated_date
    actual_updated_date = appointment_data['updated_date'].replace(microsecond=0)
    # Perform assertion
    assert actual_updated_date == expected_updated_date

def test_get_appointment_by_patient_id(db_cursor, appointment):
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)

    db_cursor.execute("UPDATE appointments SET patient_id = 999, status = 'schedule', doctor_id = 888 WHERE id = 101")
    
    result = appointment.get_appointments_by_patient_id(db_cursor, 999)
    
    assert result is not None
    assert result[0]['patient_id'] == 999
    assert result[0]['status'] == 'schedule'
    assert result[0]['doctor_id'] == 888
    expected_updated_date = datetime.now().replace(microsecond=0)
    actual_updated_date = result[0]['updated_date'].replace(microsecond=0)
    assert actual_updated_date == expected_updated_date

def test_cancel_appointment_by_patient(db_cursor, appointment):
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)

    db_cursor.execute("UPDATE appointments SET patient_id = 999, status = 'schedule', doctor_id = 888 WHERE id = 101")
    
    result = appointment.cancel_appointment_by_patient(db_cursor, 101)
    assert result is True

    db_cursor.execute("SELECT * FROM appointments WHERE id = 101")
    appointment_data = db_cursor.fetchone()


    assert appointment_data['status'] == 'open'
    assert appointment_data['patient_id'] == None
    assert appointment_data['updated_date'] is not None

def test_cancel_appointment_by_patient_error(db_cursor, appointment):
    # Prepare the database with necessary data
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    
    # Verify the initial state of the appointment with id 101
    db_cursor.execute("SELECT * FROM appointments WHERE id = 101")
    original_appointment_data = db_cursor.fetchone()
    
    result = appointment.cancel_appointment_by_patient(db_cursor, 102)
    assert result is False
    db_cursor.execute("SELECT * FROM appointments WHERE id = 101")
    updated_appointment_data = db_cursor.fetchone()
    assert updated_appointment_data['status'] == original_appointment_data['status']
    assert updated_appointment_data['patient_id'] == original_appointment_data['patient_id']
    assert updated_appointment_data['updated_date'] == original_appointment_data['updated_date']

def test_get_history_patient_appointment(db_cursor):
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    db_cursor.execute("UPDATE appointments SET patient_id = 999, status = 'completed', doctor_id = 888 WHERE id = 101")

    appointments = Appointment.get_history_patient_appointment(db_cursor, 999)
    assert appointments is not None
    assert appointments[0]['patient_id'] == 999
    assert appointments[0]['status'] == 'completed'
    assert appointments[0]['doctor_id'] == 888

def test_appointments_history_by_doctor(db_cursor):
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    db_cursor.execute("UPDATE appointments SET patient_id = 999, status = 'completed', doctor_id = 888 WHERE id = 101")

    appointments = Appointment.get_appointments_history(db_cursor, 888)
    assert appointments is not None
    assert appointments[0]['patient_id'] == 999
    assert appointments[0]['status'] == 'completed'
    assert appointments[0]['doctor_id'] == 888

def test_appoimntment_history_by_doctor_error(db_cursor):
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    db_cursor.execute("UPDATE appointments SET patient_id = 999, status = 'schedule', doctor_id = 888 WHERE id = 101")

    appointments = Appointment.get_appointments_history(db_cursor, 999)
    assert appointments == []    

def test_get_appointment_by_id(db_cursor):
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    
    appointment = Appointment.get_appointment_by_id(db_cursor, 101)
    assert appointment is not None
    assert appointment['id'] == 101
    assert appointment['date_time'] == datetime(2021, 12, 31, 12, 0, 0)
    assert appointment['doctor_id'] == 888


def test_get_all_appt(db_cursor):
    db_cursor = MagicMock()
    db_cursor.execute = MagicMock()

    db_cursor.fetchall = MagicMock(return_value=[
        {'id': 101, 'doctor_id': 888, 'date_time': '2021-12-31 12:00:00', 'status': 'open'},
        {'id': 102, 'doctor_id': 888, 'patient_id' : 999 , 'date_time': '2021-12-31 13:00:00', 'status': 'scedule'}
    ])

    appointments = Appointment.get_all_appt(db_cursor)

    assert appointments[0]['id'] == 101
    assert appointments[0]['doctor_id'] == 888
    assert appointments[0]['date_time'] == '2021-12-31 12:00:00'
    assert appointments[0]['status'] == 'open'
    assert appointments[1]['id'] == 102
    assert appointments[1]['doctor_id'] == 888
    assert appointments[1]['patient_id'] == 999
    assert appointments[1]['date_time'] == '2021-12-31 13:00:00'
    assert appointments[1]['status'] == 'scedule'

def test_add_summary(db_cursor):
    db_cursor.execute(user_insert_for_patient)
    db_cursor.execute(patient_insert)
    db_cursor.execute(user_insert_for_doctor)
    db_cursor.execute(doctor_insert)
    db_cursor.execute(appt_insert)
    db_cursor.execute("UPDATE appointments SET patient_id = 999, status = 'completed', doctor_id = 888 WHERE id = 101")
    
    summary = "Patient visited for routine check-up."
    diagnosis = "No significant issues found."
    prescription = "Take medicine X twice daily."

    result = Appointment.add_summary(db_cursor, summary, diagnosis, prescription, 101, 999)
    assert result is True

    db_cursor.execute("SELECT * FROM appointments WHERE id = 101")
    appointment_data = db_cursor.fetchone()
    assert appointment_data['summary'] == summary
    assert appointment_data['written_diagnosis'] == diagnosis
    assert appointment_data['written_prescription'] == prescription
    assert appointment_data['status'] == 'completed'

    db_cursor.execute("SELECT * FROM patients WHERE patient_id = 999")
    patient_data = db_cursor.fetchone()
    print(patient_data)
    assert diagnosis in patient_data['diagnosis'] 
    assert prescription in patient_data['prescription'] 
