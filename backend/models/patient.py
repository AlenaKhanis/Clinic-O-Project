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

        print("patient_data: ",patient_data)

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
    def get_patient_by_id(cls , patient_id , cursore):
        try:
            cursore.execute(
            """                
            SELECT
            u.full_name AS patient_name,
            m.diagnosis,
            m.prescription
            FROM
                patients p
            JOIN
                users u ON p.patient_id = u.id
            LEFT JOIN
                medical_records m ON p.id = m.patient_id
            WHERE
            p.patient_id = %s;

                            """,
            (patient_id,) )

            patient = cursore.fetchone()

            return patient
        except Exception as e:
            print("Error inserting patient:", e)
            return None  
        


