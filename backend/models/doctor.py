from dataclasses import dataclass
from typing import List, Optional
import psycopg2
from models.users import User


@dataclass
class Doctor(User):
    def __init__(self, username: str, doctor_id: int, specialty: str , password: str = None):
        super().__init__(username, password)
        self.doctor_id = doctor_id
        self.specialty = specialty


    def add_doctor(self, cursor) -> bool:
        try:

            cursor.execute(
                """
                INSERT INTO doctors (doctor_id, specialty)
                VALUES (%s, %s)
                """,
                (self.doctor_id, self.specialty)
            )
            return True
        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while inserting doctor: {e}")
            return False
        except Exception as e:
            print(f"Unexpected error occurred while inserting doctor: {e}")
            return False 
        

    @classmethod
    def get_doctor(cls, cursor, user_id :int) -> Optional[dict]:
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.username, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                WHERE u.id = %s;
                """, (user_id,))
            doctor_data = cursor.fetchone()
            return doctor_data
        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while retrieving doctor: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error occurred while retrieving doctor: {e}")
            return None
        
    @classmethod
    def get_doctor_by_specialty(cls, cursor, specialty: str) -> List[dict]:
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                WHERE d.specialty = %s;
                """, (specialty,))
            doctors_data = cursor.fetchall()
            return doctors_data
        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while retrieving doctors by specialty: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error occurred while retrieving doctors by specialty: {e}")
            return None
        

    @classmethod
    def get_doctor_patients(cls, cursor, doctor_id: int) -> List[dict]:
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
        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while retrieving doctor's patients: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error occurred while retrieving doctor's patients: {e}")
            return None
        
    @classmethod
    def get_doctor_by_name(cls, cursor, doctor_name: str) -> Optional[List[dict]]:
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                WHERE LOWER(u.full_name) LIKE LOWER(%s)
                ORDER BY u.full_name;
            """, (f'{doctor_name}%',))
            doctor_data = cursor.fetchall()
            if doctor_data:
                return doctor_data
            else:
                return None
        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while retrieving doctor by name: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error occurred while retrieving doctor by name: {e}")
            return None

        

        
    @classmethod
    def get_doctors(cls, cursor) -> List[dict]:
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id;
                """)
            doctors_data = cursor.fetchall()
            return doctors_data
        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while retrieving doctors: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error occurred while retrieving doctors: {e}")
            return None   
        