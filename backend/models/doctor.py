from dataclasses import dataclass
from datetime import datetime
from models.users import User


@dataclass
class Doctor(User):
    def __init__(self, username: str, doctor_id: int, specialty: str , password: str = None):
        super().__init__(username, password)
        self.doctor_id = doctor_id
        self.specialty = specialty


    def add_doctor(self, cursor):
        try:
            cursor.execute(
                """
                INSERT INTO doctors (doctor_id, specialty)
                VALUES (%s, %s)
                """,
                (self.doctor_id, self.specialty)
            )
            return True 
        except Exception as e:
            print("Error inserting patient:", e)
            return False  
        

    @classmethod
    def get_doctor(cls, cursor, user_id):
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.username, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                WHERE u.id = %s;
                """, (user_id,))
            doctor_data = cursor.fetchone() 
            return doctor_data
        except Exception as e:
            print(e)
            return None
        
    @classmethod
    def get_doctors_by_specialty(cls , cursor , specialty):
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                WHERE d.specialty = %s;
                """, (specialty,))
            doctors_data = cursor.fetchall() 
            return doctors_data 
        except Exception as e:
            print(e)
    @classmethod
    def get_doctor_patient(cls, cursor, doctor_id):
        try:
            cursor.execute("""
                SELECT DISTINCT p.*, u.full_name, u.age, u.email, u.phone
                FROM patients p
                INNER JOIN users u ON u.id = p.patient_id
                INNER JOIN appointments a ON a.patient_id = p.patient_id
                WHERE a.doctor_id = %s;
                """, (doctor_id,))
            patients_data = cursor.fetchall() 
            return patients_data
        except Exception as e:
            print(e)
            return None
        
    @classmethod
    def get_doctor_by_name(cls, cursor, doctor_name):
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                WHERE LOWER(u.full_name) LIKE LOWER(%s)
                ORDER BY u.full_name;
                """, (f'{doctor_name}%',))
            doctor_data = cursor.fetchall()
            return doctor_data
        except Exception as e:
            print(e)
            return None

        
    @classmethod    
    def get_doctor_by_specialty(cls,cursor,specialty):
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                WHERE d.specialty = %s;
                """, (specialty,))
            doctor_data = cursor.fetchall() 
            return doctor_data
        except Exception as e:
            print(e)
            return None
        
    @classmethod
    def get_doctors(cls, cursor):
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id;
                """)
            doctors_data = cursor.fetchall() 
            return doctors_data
        except Exception as e:
            print(e)
            return None    
        