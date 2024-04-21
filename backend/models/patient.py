from dataclasses import dataclass
from datetime import datetime
from models.users import User 
from db import get_db
from psycopg2.extras import RealDictCursor


@dataclass
class Patient(User):
    patient_id: int = 1
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
           
            patient_fields = ['patient_id', 'package', 'created_date', 'updated_date']
            patient_values = [patient_data[field] for field in patient_fields]

            user_fields = ['username', 'full_name', 'age', 'email', 'phone', 'role']
            user_values = [patient_data[field] for field in user_fields]

            
            return cls(*user_values, *patient_values)
        else:
            return None
