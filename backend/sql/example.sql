-- Insert data into the users table with hashed passwords
INSERT INTO users (username, password, email, age, full_name, phone, role, created_date, updated_date)
VALUES 
    ('admin', '$2b$12$7NM0Hrk2/yJ3hPDwCc.zwuYbJ.dJbMJ3rytb58A.uJETTpvuW4xMS', 'alona@mysite.com', 30, 'Admin', '05462224455', 'owner', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('user', '$2b$12$7NM0Hrk2/yJ3hPDwCc.zwuYbJ.dJbMJ3rytb58A.uJETTpvuW4xMS', 'user@mysite.com', 25, 'user', '456445', 'patient', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('doctor','$2b$12$7NM0Hrk2/yJ3hPDwCc.zwuYbJ.dJbMJ3rytb58A.uJETTpvuW4xMS', 'doctor@mysite.com', 45, 'doctor', '555', 'doctor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('doctorTwo','$2b$12$7NM0Hrk2/yJ3hPDwCc.zwuYbJ.dJbMJ3rytb58A.uJETTpvuW4xMS', 'doctorTwo@mysite.com', 45, 'doctorTwo', '05045454545', 'doctor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert data into the clinic table with a valid owner_id
INSERT INTO clinic (clinic_name, clinic_phone, clinic_address, clinic_description, owner_id)
VALUES ('Clinic-O', '*456', 'My Street 4', 'Clinic for all family', 1);

-- Insert data into the owner table
INSERT INTO owner (owner_id)
VALUES (1);

-- Insert data into the doctors table
INSERT INTO doctors (doctor_id, specialty)
VALUES (3, 'Cardiologist'),
       (4 ,'Cardiologist');

-- Insert data into the patients table
INSERT INTO patients (patient_id, package, prescription, diagnosis)
VALUES (2, 'Gold', '{"Take vitamin C daily"}', '{"Healthy"}');

-- Insert data into the appointments table
INSERT INTO appointments (patient_id, date_time, status, doctor_id , summary , written_prescription , written_diagnosis)
VALUES (2, '2024-06-10 10:00:00', 'completed', 3 , 'Checkup', 'Take vitamin C daily', 'Healthy');
        
