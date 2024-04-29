from dataclasses import dataclass
from datetime import datetime


@dataclass
class Appointment:
    date: datetime
    time: datetime
    doctor_id: int
    status: str 
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()
    patient_id: int = None 
    summery: str = None
    written_diagnosis: str = None
    written_prescriptions: str = None



    def add_open_appointment_for_doctor(self, cursor):
        sql = """
            INSERT INTO appointments (date, time , doctor_id, status, created_date, updated_date)
            VALUES (%s, %s, %s, %s, %s ,%s)
        """
        try:
            cursor.execute(sql, (self.date , self.time, self.doctor_id, self.status, self.created_date, self.updated_date))
            return True 
        except Exception as e:
            print(f"Error occurred while adding appointment: {e}")
            return False

    @classmethod
    def check_appointment_exists(cls, appointment_date, appointment_time , doctor_id, cursor):
        try:
            cursor.execute(
                """
                SELECT id FROM appointments WHERE date = %s AND time= %s AND doctor_id = %s
                """,
                (appointment_date,appointment_time, doctor_id,)
            )
            existing_appointment = cursor.fetchone()
            print(existing_appointment)
            

            if existing_appointment:
                print("exsist app:" ,existing_appointment )
                print("return true!")
                return True
            else:
                return False
        except Exception as e:
            print("Error checking appointment:", e)
            return False
        
    @classmethod   
    def get_appointment_by_doctor_id( cls ,cursor , doctor_id):
        try: 
            cursor.execute ("""
                SELECT * FROM appointments WHERE doctor_id = %s
                """ ,
                (doctor_id,))
            
            all_appointments = cursor.fetchall()
            if all_appointments:
                return all_appointments
            else:
                return False
        except Exception as e:
            print("Error getting appointments:", e)

    def scedual_appointment_for_patient(cursor , appointment_id , patient_id):
        try:
            cursor.execute(
                """
                UPDATE appointments SET patient_id = %s , status = 'scedual' WHERE id = %s
                """ , 
                ( patient_id , appointment_id,))
        except Exception as e:
            print("Error scedualing appointment:", e)
            return False

    
    