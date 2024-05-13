from dataclasses import dataclass
from datetime import datetime
from models.users import User 


@dataclass
class Patient(User):
    patient_id: int = None
    package: str = "silver"
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()

    @classmethod
    def get_patient(cls, cursor, user_id):
        cursor.execute("""
            SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone, u.role 
            FROM patients p
            INNER JOIN users u ON u.id = p.patient_id
            WHERE u.id = %s;
            """, (user_id,))
        patient_data = cursor.fetchone() 
        if patient_data:
            return patient_data
        else:
            return None
        
    def add_patient(self, cursor):
        try:
            cursor.execute(
                """
                INSERT INTO patients (patient_id, package, created_date, updated_date)
                VALUES (%s, %s, %s, %s)
                """,
                (self.patient_id, self.package, self.created_date, self.updated_date)
            )

            return True 
        except Exception as e:
            print("Error inserting patient:", e)
            return False  
        



