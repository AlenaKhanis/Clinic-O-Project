from dataclasses import dataclass
from datetime import datetime
from models.users import User 


@dataclass
class Owner(User):
    owner_id: int = None
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()

    @classmethod
    def get_owner(cls, cursor, user_id):
        cursor.execute("""
            SELECT DISTINCT o.*, u.username, u.full_name, u.age, u.email, u.phone, u.role 
            FROM owner o
            INNER JOIN users u ON u.id = o.owner_id
            WHERE u.id = %s;
            """, (user_id,))
        owner_data = cursor.fetchone()


        if owner_data:
            return owner_data
        else:
            return None


