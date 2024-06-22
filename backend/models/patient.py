from dataclasses import dataclass
from models.users import User
from psycopg2 import Error, DatabaseError
from typing import Optional ,List


@dataclass
class Patient(User):
    def __init__(self, username: str, password: str = None, patient_id: int = None, package: str = "silver"):
        super().__init__(username, password)
        self.patient_id = patient_id
        self.package = package

    def add_patient(self, cursor) -> bool:
        try:
            cursor.execute(
                """
                INSERT INTO patients (patient_id, package)
                VALUES (%s, %s)
                """,
                (self.patient_id, self.package)
            )
            return True
        except (Error, DatabaseError) as e:
            print(f"Error inserting patient: {e}")
            return False

    @classmethod
    def get_patient(cls, cursor, patient_id: int) -> Optional[dict]:
        try:
            cursor.execute("""
                SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone
                FROM patients p
                INNER JOIN users u ON u.id = p.patient_id
                WHERE u.id = %s;
                """, (patient_id,))
            patient_data = cursor.fetchone()
            return patient_data  # Returns patient data as a dictionary if found, otherwise None
        except (Error, DatabaseError) as e:
            print(f"Error retrieving patient: {e}")
            return None

    @classmethod
    def get_patient_doctors(cls, cursor, patient_id: int) -> List[dict]: 
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                INNER JOIN appointments a ON a.doctor_id = d.doctor_id
                WHERE a.patient_id = %s;
                """, (patient_id,))
            doctor_data = cursor.fetchall()
            return doctor_data  # Returns a list of doctors treating the patient, or None if not found
        except (Error, DatabaseError) as e:
            print(f"Error retrieving doctors for patient: {e}")
            return None

    @classmethod
    def get_all_patients(cls, cursor) -> List[dict]:
        try:
            cursor.execute("""
                SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone
                FROM patients p
                INNER JOIN users u ON u.id = p.patient_id;
                """)
            patients_data = cursor.fetchall()
            return patients_data  
        except (Error, DatabaseError) as e:
            print(f"Error retrieving all patients: {e}")
            return None
