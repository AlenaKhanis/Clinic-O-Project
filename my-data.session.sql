SELECT * FROM appointments 
WHERE doctor_id = 3 
AND (date < CURRENT_DATE 
    OR (date = CURRENT_DATE AND EXTRACT(HOUR FROM time) * 3600 + EXTRACT(MINUTE FROM time) * 60 + EXTRACT(SECOND FROM time) <= EXTRACT(HOUR FROM CURRENT_TIME) * 3600 + EXTRACT(MINUTE FROM CURRENT_TIME) * 60 + EXTRACT(SECOND FROM CURRENT_TIME)))
AND status = 'scedual';
