from dataclasses import dataclass
from datetime import datetime
import logging
import psycopg2
from typing import List, Optional

@dataclass
class Appointment:
    date_time: datetime
    doctor_id: int
    status: str
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()
    patient_id: Optional[int] = None
    summary: Optional[str] = None
    written_diagnosis: Optional[str] = None
    written_prescriptions: Optional[str] = None

    def add_open_appointment_for_doctor(self, cursor) -> bool:
        sql_query = """
            INSERT INTO appointments (date_time, doctor_id, status, created_date, updated_date)
            VALUES (%s, %s, %s, %s, %s)
        """
        try:
            cursor.execute(sql_query, (self.date_time, self.doctor_id, self.status, self.created_date, self.updated_date))
            return True
        except psycopg2.IntegrityError as e:
            logging.error(f"PostgreSQL IntegrityError occurred while adding appointment: {e}")
            cursor.connection.rollback()
            return False
        except psycopg2.DatabaseError as e:
            logging.error(f"PostgreSQL DatabaseError occurred while adding appointment: {e}")
            cursor.connection.rollback()
            return False
        except Exception as e:
            logging.error(f"Unexpected error occurred while adding appointment: {e}")
            cursor.connection.rollback()
            return False

    @classmethod
    def check_appointment_exists(cls, appointment_datetime: datetime, doctor_id: int, cursor) -> bool:
        sql_query = """
            SELECT id FROM appointments WHERE date_time = %s AND doctor_id = %s AND status IN ('schedule', 'open')
        """
        try:
            cursor.execute(sql_query, (appointment_datetime, doctor_id))
            existing_appointment = cursor.fetchone()
            return existing_appointment is not None
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while checking appointment: {e}")
            return False
        except Exception as e:
            logging.error(f"Unexpected error occurred while checking appointment: {e}")
            return False

    @classmethod
    def get_appointment_by_doctor_id(cls, cursor, doctor_id: int) -> List[dict]:
        sql_query = """
            SELECT * FROM appointments 
            WHERE doctor_id = %s 
            AND status IN ('schedule', 'open', 'completed')
        """
        try:
            cursor.execute(sql_query, (doctor_id,))
            all_appointments = cursor.fetchall()
            return all_appointments
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while getting appointments: {e}")
            return []
        except Exception as e:
            logging.error(f"Unexpected error occurred while getting appointments: {e}")
            return []

    @classmethod
    def schedule_appointment_for_patient(cls, cursor, appointment_id: int, patient_id: int) -> bool:
        try:
            cursor.execute("SELECT status FROM appointments WHERE id = %s", (appointment_id,))
            appointment_status = cursor.fetchone()
            if appointment_status and appointment_status['status'] == 'schedule':
                return False

            cursor.execute(
                """
                UPDATE appointments SET patient_id = %s, status = 'schedule', updated_date = CURRENT_TIMESTAMP
                WHERE id = %s
                """,
                (patient_id, appointment_id)
            )
            cursor.connection.commit()
            return True
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while scheduling appointment: {e}")
            cursor.connection.rollback()
            return False
        except Exception as e:
            logging.error(f"Unexpected error occurred while scheduling appointment: {e}")
            cursor.connection.rollback()
            return False

    @classmethod
    def get_appointments_by_patient_id(cls, cursor, patient_id: int) -> List[dict]:
        sql_query = """
            SELECT * FROM appointments WHERE patient_id = %s
        """
        try:
            cursor.execute(sql_query, (patient_id,))
            appointments = cursor.fetchall()
            return appointments
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while getting appointments: {e}")
            return []
        except Exception as e:
            logging.error(f"Unexpected error occurred while getting appointments: {e}")
            return []

    @classmethod
    def cancel_appointment_by_patient(cls, cursor, appointment_id: int) -> bool:
        sql_query = """
            UPDATE appointments 
            SET status = 'open', patient_id = NULL, updated_date = CURRENT_TIMESTAMP
            WHERE id = %s
        """
        try:
            cursor.execute(sql_query, (appointment_id,))
            return True
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while cancelling appointment: {e}")
            cursor.connection.rollback()
            return False
        except Exception as e:
            logging.error(f"Unexpected error occurred while cancelling appointment: {e}")
            cursor.connection.rollback()
            return False

    @classmethod
    def get_history_patient_appointment(cls, cursor, patient_id: int) -> List[dict]:
        sql_query = """
            SELECT * FROM appointments WHERE patient_id = %s AND status = 'completed'
        """
        try:
            cursor.execute(sql_query, (patient_id,))
            appointments = cursor.fetchall()
            return appointments
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while fetching history patient appointments: {e}")
            return []
        except Exception as e:
            logging.error(f"Unexpected error occurred while fetching history patient appointments: {e}")
            return []

    @classmethod
    def add_summary(cls, cursor, summary: str, diagnosis: str, prescription: str, appointment_id: int, patient_id: int) -> bool:
        try:
            # Update the appointments table
            appointment_query = """
                UPDATE appointments
                SET summary = %s,
                    written_diagnosis = %s,
                    written_prescriptions = %s,
                    status = 'completed',
                    updated_date = CURRENT_TIMESTAMP,
                    date_time = CURRENT_TIMESTAMP
                WHERE id = %s
            """
            cursor.execute(appointment_query, (summary, diagnosis, prescription, appointment_id))

            # Update the patients table with prescription and diagnosis
            patient_query = """
                UPDATE patients
                SET diagnosis = COALESCE(diagnosis, '') || %s,
                    prescription = COALESCE(prescription, '') || %s
                WHERE id = %s
            """
            cursor.execute(patient_query, (diagnosis, prescription, patient_id))

            cursor.connection.commit()
            return True
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while adding summary: {e}")
            cursor.connection.rollback()
            return False
        except Exception as e:
            logging.error(f"Unexpected error occurred while adding summary: {e}")
            cursor.connection.rollback()
            return False

    @classmethod
    def get_appointments_history(cls, cursor, doctor_id: int) -> List[dict]:
        sql_query = """
            SELECT * FROM appointments 
            WHERE doctor_id = %s
            AND status = 'completed'
        """
        try:
            cursor.execute(sql_query, (doctor_id,))
            appointments = cursor.fetchall()
            return appointments
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while getting appointment history: {e}")
            return []
        except Exception as e:
            logging.error(f"Unexpected error occurred while getting appointment history: {e}")
            return []

    @classmethod
    def get_appointment_by_id(cls, cursor, appointment_id: int) -> Optional[dict]:
        sql_query = """
            SELECT * FROM appointments WHERE id = %s
        """
        try:
            cursor.execute(sql_query, (appointment_id,))
            appointment = cursor.fetchone()
            return appointment
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while getting appointment by id: {e}")
            return None
        except Exception as e:
            logging.error(f"Unexpected error occurred while getting appointment by id: {e}")
            return None

    @classmethod
    def get_all_appt(cls, cursor) -> List[dict]:
        sql_query = """
            SELECT * FROM appointments
        """
        try:
            cursor.execute(sql_query)
            appointments = cursor.fetchall()
            return appointments
        except psycopg2.Error as e:
            logging.error(f"PostgreSQL error occurred while getting all appointments: {e}")
            return []
        except Exception as e:
            logging.error(f"Unexpected error occurred while getting all appointments: {e}")
            return []
