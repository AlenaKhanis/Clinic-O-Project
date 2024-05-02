SELECT * FROM appointments 
    WHERE doctor_id = 3 
    AND date_time(date_time) <= CURRENT_TIMESTAMP
