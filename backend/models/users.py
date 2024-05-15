from dataclasses import dataclass
# from typing import Optional
from datetime import datetime
from db import get_db


#TODO: Add more error hadaling for psycopg2

@dataclass
class User:
    username: str
    password: str
    full_name: str = ""
    age: int = None
    email: str = ""
    phone: str = ""
    role: str = ""

    @classmethod
    def check_username_exists(cls, username ,cursor):

        try:
            cursor.execute(
                """
                SELECT id FROM users WHERE username = %s
                """,
                (username,)
            )
            existing_user = cursor.fetchone()

            if existing_user:
                return True
            else:
                return False
        except Exception as e:
            print("Error checking username:", e)
            return False
        
    
    def add_user(self, cursor):
        try:
            cursor.execute(
                """
                INSERT INTO users (username, password, email, full_name, role)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
                """,
                (self.username, self.password, self.email, self.full_name, self.role)
            )
            self.id = cursor.fetchone()[0] 
            return self.id
        except Exception as e:
            print("Error inserting user:", e)
            return None

    @classmethod
    def edit_doctor_user_profile(cls, cursor, doctor_id, field, value):
        try:
            cursor.execute(f"""
                UPDATE users
                SET {field} = %s
                WHERE id = %s;
            """, (value, doctor_id))

            return "Doctor profile updated successfully"
        except Exception as e:
            return f"Error updating doctor profile: {e}"


