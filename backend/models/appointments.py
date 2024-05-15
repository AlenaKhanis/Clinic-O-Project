from dataclasses import dataclass
from datetime import datetime
import logging

import psycopg2



#TODO: Add Documentation

@dataclass
class Appointment:
    date_time: datetime
    doctor_id: int
    status: str 
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()
    patient_id: int = None 
    summery: str = None
    written_diagnosis: str = None
    written_prescriptions: str = None

#TODO: Add more error hadaling for psycopg2


    def add_open_appointment_for_doctor(self, cursor) -> bool:
        sql = """
            INSERT INTO appointments (date_time, doctor_id, status, created_date, updated_date)
            VALUES (%s, %s, %s, %s, %s)
        """
        try:
            cursor.execute(sql, (self.date_time, self.doctor_id, self.status, self.created_date, self.updated_date))
            return True
        except psycopg2.IntegrityError as e:
            logging.error(f"IntegrityError occurred while adding appointment: {e}")
            return False
        except psycopg2.Error as e:
            logging.error(f"Database error occurred while adding appointment: {e}")
            return False
        except Exception as e:
            logging.error(f"Unexpected error occurred while adding appointment: {e}")
            return False

    #TODO: change to check_appointment_exists in doctor
    @classmethod
    def check_appointment_exists(cls, appointment_datetime, id, cursor) -> bool:
        try:
            cursor.execute(
                """
                SELECT id FROM appointments WHERE date_time = %s AND doctor_id = %s AND status IN ('schedule', 'open')
                """,
                (appointment_datetime, id)
            )
            existing_appointment = cursor.fetchone()
            
            if existing_appointment:
                return True
            else:
                return False
        except Exception as e:
            print("Error checking appointment:", e)
            return False

        
    @classmethod   
    def get_appointment_by_doctor_id(cls, cursor, doctor_id) -> dict:
        try:
  
            cursor.execute("""
                SELECT * FROM appointments 
                WHERE doctor_id = %s 
                AND status IN ('schedule', 'open')
                """,
                (doctor_id))

            all_appointments = cursor.fetchall()

            return all_appointments

        except Exception as e:
            print("Error getting appointments:", e)


    @classmethod
    def scedual_appointment_for_patient(cls , cursor , appointment_id , patient_id) -> dict:
        try:
            cursor.execute(
            """
            SELECT status FROM appointments WHERE id = %s
            """,
            (appointment_id,)
            )
            appointment_status = cursor.fetchone()
        
            if appointment_status and appointment_status['status'] == 'schedule':
                return False

            cursor.execute(
                """
                UPDATE appointments SET patient_id = %s, status = 'schedule' , updated_date = CURRENT_TIMESTAMP  WHERE id = %s
                """,
                (patient_id, appointment_id,)
            )
            return True
        
        except Exception as e:
            print("Error scedualing appointment:", e)
            return False

    @classmethod
    def get_appointments_by_patient_id(cls, cursor, patient_id) -> dict:
        try:
            cursor.execute("""
                SELECT * FROM appointments WHERE patient_id = %s
            """, (patient_id,))
            appointments = cursor.fetchall()
            return appointments
        except Exception as e:
            print("Error getting appointments:", e)
            return None
#TODO: change to cansel appointment by patient
    @classmethod
    def cancel_appointment(cls, cursor, appointment_id) -> bool:
        try:
            cursor.execute("""
                UPDATE appointments 
                SET status = 'open', patient_id = NULL , updated_date = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (appointment_id,))
            return True
        except Exception as e:
            print("Error cancelling appointment:", e)
            return False

    @classmethod
    def get_history_patient_appointment(cls, cursor, patient_id):
        try:
            cursor.execute(
                """
                SELECT * FROM appointments WHERE patient_id = %s AND status = 'completed';
                """,
                (patient_id,)
            )
            appointments = cursor.fetchall()
            return appointments
        except Exception as e:
            print("Error fetching history patient appointments:", e)
            return None

    #TODO: add summery by doctor
    @classmethod
    def add_summary(cls, cursor, summary, diagnosis, prescription, appointment_id, patient_id):
        try:
            # Update the appointments table
            appointment_query = """
                UPDATE appointments
                SET summery = %s,
                    writen_diagnosis = %s,
                    writen_prescription = %s,
                    status = 'completed'
                WHERE id = %s
            """
            cursor.execute(appointment_query, (summary, diagnosis, prescription, appointment_id))

            # Update the patients table with prescription and diagnosis
            patient_query = """
                UPDATE patients
                SET deagnosis = deagnosis || %s,
                prescription = prescription || %s
                WHERE patient_id = %s
            """
            cursor.execute(patient_query, ([diagnosis], [prescription], patient_id))

            # Commit the changes
            cursor.connection.commit()

            return True  # Operation succeeded
        except Exception as e:
            # Rollback changes if an error occurs
            cursor.connection.rollback()
            print("Error:", e)
            return False  # Operation failed

#TODO: change to get_appointments_history by doctor
    @classmethod
    def get_appointments_history(cls ,cursor , doctor_id):
        try:
            cursor.execute("""
                SELECT * FROM appointments 
                    WHERE doctor_id = %s
                    AND status = 'completed';
            """, (doctor_id,))
            appointments = cursor.fetchall()
            return appointments
        except Exception as e:
            print("Error getting appointment history:", e)

