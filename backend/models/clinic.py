#Using SQLAlchemy
from datetime import datetime


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
    def update_clinic_details(cls, cursor, data) -> bool:
        try:
            for field, value in data.items():
                cursor.execute(f"""
                    UPDATE clinic
                    SET {field} = %s
                    WHERE id = 1;
                    """, (value,))
                print(f"{field} updated successfully")
            return True
        except Exception as e:
            print(f"An error occurred: {e}")
            return False
  

        