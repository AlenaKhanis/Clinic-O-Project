DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    age INTEGER,
    full_name TEXT NOT NULL,  
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('owner', 'patient', 'doctor', 'pharmacy_manager')) 
);


DROP  TABLE IF EXISTS patients CASCADE;
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    patient_id  INTEGER NOT NULL, 
    package TEXT NOT NULL CHECK (package IN('premium', 'gold', 'silver')) DEFAULT 'silver',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users (id)
);

DROP  TABLE IF EXISTS doctors CASCADE;
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    specialty TEXT NOT NULL DEFAULT '',
    open_appointments TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users (id)
);


DROP  TABLE IF EXISTS clinic CASCADE;
CREATE TABLE IF NOT EXISTS clinic (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    clinic_name TEXT,
    clinic_phone TEXT,
    clinic_address TEXT,
    clinic_description TEXT,
    FOREIGN KEY (owner_id) REFERENCES users (id)
);


DROP  TABLE IF EXISTS doctor_patient CASCADE;
CREATE TABLE IF NOT EXISTS doctor_patient (
    doctor_id INTEGER NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors (id),
    patient_id INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

DROP  TABLE IF EXISTS appointments CASCADE;
CREATE TABLE IF NOT EXISTS appointments (
    patient_id INTEGER NOT NULL,
    date_time TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN('pending', 'confirmed', 'cancelled')),
    doctor_id INTEGER NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors (id),
    FOREIGN KEY (patient_id) REFERENCES patients (id),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


DROP  TABLE  IF EXISTS medical_records CASCADE;
CREATE TABLE IF NOT EXISTS medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients (id),
    doctor_id INTEGER NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors (id),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,   
    diagnosis TEXT NOT NULL,
    prescription TEXT NOT NULL
);

DROP TABLE IF EXISTS owner CASCADE;
CREATE TABLE IF NOT EXISTS owner (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users (id)
);


-- Drop the existing trigger
DROP TRIGGER IF EXISTS insert_user_data_trigger ON users;

-- Create a trigger function to handle insertion based on user's role
CREATE OR REPLACE FUNCTION insert_user_data_based_on_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into patients table if role is 'patient'
    IF NEW.role = 'patient' THEN
        INSERT INTO patients (patient_id) VALUES (NEW.id);
    -- Insert into doctors table if role is 'doctor'
    ELSIF NEW.role = 'doctor' THEN
        INSERT INTO doctors (doctor_id) VALUES (NEW.id);

    ELSEIF NEW.role = 'owner' THEN
        INSERT INTO owner (owner_id) VALUES (NEW.id);
    END IF;

    -- Return NEW to allow the original insertion into the users table to proceed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to execute the trigger function after insertion into the users table
CREATE TRIGGER insert_user_data_trigger
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_user_data_based_on_role();

-- Insert data into the users table first
INSERT INTO users (username, password, email, age, full_name, phone, role)
VALUES ('Alona', '1234', 'alona@mysite.com', 30, 'Alona Khanis', '05462224455', 'owner'),
    ('user', '1234', 'user@mysite.com', 25, 'user', '456445', 'patient'),
    ('doctor', '5454', 'docrot@mysite.com', 45, 'doctor', '555', 'doctor');

-- Now, insert data into the clinic table with a valid owner_id
INSERT INTO clinic (clinic_name, clinic_phone, clinic_address, clinic_description, owner_id)
VALUES ('Clinic-O', '*456', 'My Street 4', 'Clinic for all family', 1);

UPDATE doctors 
SET specialty = 'dentist'
WHERE doctor_id = 3;




