from dataclasses import dataclass
from datetime import datetime
from models.users import User 


#TODO: Add more error hadaling for psycopg2

#TODO: When add or update - change the update time.


@dataclass
class Patient(User):
    patient_id: int = None
    package: str = "silver"
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()

    

    @classmethod
    #TODO: change to get patient by id
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
        
    @classmethod
    def get_patient_doctors(cls, cursor, patient_id):
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.full_name, u.age, u.email, u.phone
                FROM doctors d
                INNER JOIN users u ON u.id = d.doctor_id
                INNER JOIN appointments a ON  d.doctor_id =  d.doctor_id
                WHERE a.patient_id = %s;
                """, (patient_id,))
            docotr_data = cursor.fetchall() 
            return docotr_data
        except Exception as e:
            print(e)
            return None

