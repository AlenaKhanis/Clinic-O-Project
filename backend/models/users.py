from dataclasses import dataclass
from datetime import datetime
import psycopg2
from typing import Optional , List


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
    def check_username_exists(cls, username: str, cursor) -> bool:
        try:
            cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
            existing_user = cursor.fetchone()
            return existing_user is not None
        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while checking username: {e}")
            return False
        except Exception as e:
            print(f"Unexpected error occurred while checking username: {e}")
            return False

    def add_user(self, cursor) -> int:
        
        try:
            cursor.execute("""
                INSERT INTO users (username, password, email, full_name, role, age, phone, created_date, updated_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (self.username, self.password, self.email, self.full_name, self.role,
                self.age, self.phone, self.created_date, self.updated_date)
            )

            inserted_row = cursor.fetchone()
            print(f"Inserted row: {inserted_row}")
            if inserted_row:
                self.id = inserted_row["id"]
                return self.id
            else:
                print("No ID returned after insertion")
                return None

        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while inserting user: {e}")
            return None 
        except Exception as e:
            print(f"Unexpected error occurred while inserting user: {e}")
            return None 


    @classmethod
    def get_user(cls, cursor, user_id: int) -> Optional[dict]:
        try:
            cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            user = cursor.fetchone()
            return user
        except psycopg2.Error as e:
            print(f"PostgreSQL error occurred while retrieving user: {e}")
            return None
        except Exception as e:
            print(f"Unexpected error occurred while retrieving user: {e}")
            return None

    @classmethod
    def edit_user_profile(cls, cursor, user_id :int, field :str, value: str) -> Optional[dict]:
        try:
            updated_data = None

            if field == 'specialty':
                cursor.execute("""
                    UPDATE doctors
                    SET specialty = %s
                    WHERE doctor_id = %s;
                    """, (value, user_id))
                cursor.execute("""
                    SELECT DISTINCT d.*, u.username, u.full_name, u.age, u.email, u.phone 
                    FROM doctors d
                    INNER JOIN users u ON u.id = d.doctor_id
                    WHERE d.doctor_id = %s;
                    """, (user_id,))
                updated_data = cursor.fetchone()
                return updated_data

            elif field == 'package':
                cursor.execute("""
                    UPDATE patients
                    SET package = %s
                    WHERE patient_id = %s;
                    """, (value, user_id))
                cursor.execute("""
                    SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone 
                    FROM patients p
                    INNER JOIN users u ON u.id = p.patient_id
                    WHERE p.patient_id = %s;
                    """, (user_id,))
                updated_data = cursor.fetchone()
                return updated_data

            else:
                cursor.execute(f"""
                    UPDATE users
                    SET {field} = %s,
                        updated_date = CURRENT_TIMESTAMP
                    WHERE id = %s;
                    """, (value, user_id))
                cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                updated_data = cursor.fetchone()
                return updated_data

        except psycopg2.Error as e:
            return f"PostgreSQL error occurred while updating user profile: {e}", None
        except Exception as e:
            return f"Unexpected error occurred while updating user profile: {e}", None

    @classmethod
    def delete_user(cls, cursor, user_id: int) -> str:
        try:
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            return "User deleted successfully"
        except psycopg2.Error as e:
            return f"PostgreSQL error occurred while deleting user: {e}"
        except Exception as e:
            return f"Unexpected error occurred while deleting user: {e}"
