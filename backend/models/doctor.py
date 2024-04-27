from dataclasses import dataclass
from datetime import datetime
from models.users import User


@dataclass
class Doctor(User):
    doctor_id: int = None
    specialty: str = ""
    open_appointments: datetime = datetime.now()
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()

    @classmethod
    def get_doctor(cls, cursor, user_id):
        try:
            cursor.execute("""
                SELECT DISTINCT d.*, u.username, u.full_name, u.age, u.email, u.phone, u.role 
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
