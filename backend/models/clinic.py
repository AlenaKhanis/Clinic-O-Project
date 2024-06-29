
from datetime import datetime
import psycopg2


class Clinic():
    
    clinic_name = str
    clinic_address = str
    clinic_phone = str
    owner_id = int
    clinic_description = str
    clinic_email = str
    clinic_created_date = datetime.now()
    clinic_updated_date = datetime.now()


    @classmethod
    def update_clinic_details(cls, cursor, data: dict) -> bool:
        try:
            for field, value in data.items():
                cursor.execute(f"""
                    UPDATE clinic
                    SET {field} = %s,
                        updated_date = CURRENT_TIMESTAMP
                    WHERE id = %s;
                """, (value, 1))
                print(f"{field} updated successfully")
            return True
        except psycopg2.IntegrityError as e:
            cursor.connection.rollback()
            print(f"PostgreSQL IntegrityError occurred: {e}")
            return False
        except psycopg2.DatabaseError as e:
            cursor.connection.rollback()
            print(f"PostgreSQL DatabaseError occurred: {e}")
            return False
        except Exception as e:
            cursor.connection.rollback()
            print(f"An unexpected error occurred: {e}")
            return False

  

        