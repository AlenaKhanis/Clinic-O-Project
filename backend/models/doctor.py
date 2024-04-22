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
        print(user_id)
        cursor.execute("""
            SELECT DISTINCT d.*, u.username, u.full_name, u.age, u.email, u.phone, u.role 
            FROM doctors d
            INNER JOIN users u ON u.id = d.doctor_id
            WHERE u.id = %s;
            """, (user_id,))
        doctor_data = cursor.fetchone() 
        if doctor_data:
            return doctor_data
        else:
            return None
