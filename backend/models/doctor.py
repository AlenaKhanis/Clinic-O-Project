from dataclasses import dataclass
from datetime import datetime
from models.users import User


@dataclass
class Doctor(User):
    doctor_id: int = 1
    specialty: str = ""
    open_appointments: datetime = datetime.now()
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()

    @classmethod
    def get_doctor(cls, cursor, user_id):
        cursor.execute("""
            SELECT DISTINCT d.*, u.username, u.full_name, u.age, u.email, u.phone, u.role 
            FROM doctors d
            INNER JOIN users u ON u.id = d.doctor_id
            WHERE u.id = %s;
            """, (user_id,))
        doctor_data = cursor.fetchone()

        if doctor_data:
            doctor_fields = ['doctor_id', 'specialty', 'open_appointments', 'created_date', 'updated_date']
            doctor_values = [doctor_data[field] for field in doctor_fields]

            user_fields = ['username', 'full_name', 'age', 'email', 'phone', 'role']
            user_values = [doctor_data[field] for field in user_fields]

            return cls(*user_values, *doctor_values)
        else:
            return None
