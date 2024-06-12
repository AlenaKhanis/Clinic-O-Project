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
        print(username)

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
                INSERT INTO users (username, password, email, full_name, role , age , phone)
                VALUES (%s, %s, %s, %s, %s ,%s ,%s)
                RETURNING id
                """,
                (self.username, self.password, self.email, self.full_name, self.role , self.age , self.phone)
            )
            self.id = cursor.fetchone()[0] 
            return self.id
        except Exception as e:
            print("Error inserting user:", e)
            return None
            
    @classmethod
    def edit_user_profile(cls, cursor, user_id, field, value):
        try:
            if field == 'specialty':  
                cursor.execute(f"""
                    UPDATE doctors
                    SET {field} = %s
                    WHERE doctor_id = %s;
                """, (value, user_id))
            else:    
                cursor.execute(f"""
                    UPDATE users
                    SET {field} = %s
                    WHERE id = %s;
                """, (value, user_id))

            cursor.execute(f"""
                SELECT * FROM users
                WHERE id = %s;
            """, (user_id,))
            updated_data = cursor.fetchone()

            return "Doctor profile updated successfully", updated_data
        except Exception as e:
            return f"Error updating doctor profile: {e}", None


    @classmethod
    def delete_user_doctor(cls, cursor, doctor_id):
        try:
            cursor.execute("DELETE FROM doctors WHERE user_id = %s", (doctor_id,))
            cursor.execute("DELETE FROM users WHERE id = %s", (doctor_id,))
            return "Doctor deleted successfully"
        except Exception as e:
             return f"Error deleting doctor: {e}"