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
    created_date: datetime = datetime.now()
    updated_date: datetime = datetime.now()


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
                INSERT INTO users (username, password, email, full_name, role , age , phone , created_date, updated_date)
                VALUES (%s, %s, %s, %s, %s ,%s ,%s ,%s ,%s)
                RETURNING id
                """,
                (self.username, self.password, self.email, self.full_name, self.role , self.age , self.phone , self.created_date, self.updated_date)
            )
            self.id = cursor.fetchone()[0] 
            return self.id
        except Exception as e:
            print("Error inserting user:", e)
            return None

    @classmethod
    def get_user(cls, cursor, user_id):
        try:
            cursor.execute(
                """
                SELECT * FROM users WHERE id = %s
                """,
                (user_id,)
            )
            user = cursor.fetchone()
            return user
        except Exception as e:
            print("Error getting user:", e)
            return None    
            
    @classmethod
    def edit_user_profile(cls, cursor, user_id, field, value):
        try:
            updated_data = None

            if field == 'specialty':
                # Update specialty for doctors
                cursor.execute("""
                    UPDATE doctors
                    SET specialty = %s
                    WHERE doctor_id = %s;
                """, (value, user_id))

                # Fetch updated doctor profile
                cursor.execute("""
                    SELECT DISTINCT d.*, u.username, u.full_name, u.age, u.email, u.phone 
                    FROM doctors d
                    INNER JOIN users u ON u.id = d.doctor_id               
                    WHERE d.doctor_id = %s;
                """, (user_id,))
                updated_data = cursor.fetchone()
                return "Doctor profile updated successfully", updated_data
            
            elif field == 'package':
                # Update package for patients
                cursor.execute("""
                    UPDATE patients
                    SET package = %s
                    WHERE patient_id = %s;
                """, (value, user_id))

                # Fetch updated patient profile
                cursor.execute("""
                    SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone 
                    FROM patients p
                    INNER JOIN users u ON u.id = p.patient_id               
                    WHERE p.patient_id = %s;
                """, (user_id,))
                updated_data = cursor.fetchone()
                return "Patient profile updated successfully", updated_data
            
            else:
                # Update other fields in users table
                cursor.execute(f"""
                    UPDATE users
                    SET {field} = %s,
                        updated_date = CURRENT_TIMESTAMP
                    WHERE id = %s;
                """, (value, user_id))

                # Fetch updated user profile
                cursor.execute("""
                    SELECT * FROM users
                    WHERE id = %s;
                """, (user_id,))
                updated_data = cursor.fetchone()

                return "User profile updated successfully", updated_data

        except Exception as e:
            return f"Error updating user profile: {e}", None






    @classmethod
    def delete_user(cls, cursor, user_id):    
        try:
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            return "Doctor deleted successfully"
        except Exception as e:
             return f"Error deleting doctor: {e}"