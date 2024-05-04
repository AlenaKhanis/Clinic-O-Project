

INSERT INTO users (username, password, email, age, full_name, phone, role)
VALUES ('Doctor', '8989', 'alona@mysite.com', 30, 'Alona Khanis', '05462224455', 'doctor');


SELECT * FROM users WHERE id = 3;

-- Now, insert data into the patients table
INSERT INTO doctors (
    doctor_id,
    specialty,
    created_date,
    updated_date
)
VALUES (
    4,  -- Replace with the valid patient_id from the users table
    'Family Doctor',
    CURRENT_TIMESTAMP,  -- Set the created_date to the current timestamp
    CURRENT_TIMESTAMP  -- Set the updated_date to the current timestamp
);