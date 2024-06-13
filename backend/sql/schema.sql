-- Drop existing tables if they exist
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctor_patient CASCADE;
DROP TABLE IF EXISTS clinic CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS owner CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create the users table
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

-- Create the patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER UNIQUE NOT NULL, 
    package TEXT NOT NULL CHECK (package IN ('Premium', 'Gold', 'Silver')) DEFAULT 'Silver',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    prescription TEXT[],
    diagnosis TEXT[],
    FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create the doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER UNIQUE NOT NULL,
    specialty TEXT NOT NULL DEFAULT '',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create the clinic table
CREATE TABLE IF NOT EXISTS clinic (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    clinic_name TEXT,
    clinic_phone TEXT,
    clinic_address TEXT,
    clinic_description TEXT,
    clinic_email TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create the doctor_patient table
CREATE TABLE IF NOT EXISTS doctor_patient (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id) ON DELETE CASCADE
);

-- Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER,
    date_time TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('schedule', 'cancelled', 'open', 'completed')),
    doctor_id INTEGER NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    summary TEXT,
    written_prescription TEXT,
    written_diagnosis TEXT,
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id) ON DELETE CASCADE
);

-- Create the owner table
CREATE TABLE IF NOT EXISTS owner (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Insert data into the users table
INSERT INTO users (username, password, email, age, full_name, phone, role)
VALUES 
    ('Alona', '1234', 'alona@mysite.com', 30, 'Alona Khanis', '05462224455', 'owner'),
    ('user', '1234', 'user@mysite.com', 25, 'user', '456445', 'patient'),
    ('doctor', '5454', 'doctor@mysite.com', 45, 'doctor', '555', 'doctor');

-- Insert data into the clinic table with a valid owner_id
INSERT INTO clinic (clinic_name, clinic_phone, clinic_address, clinic_description, owner_id)
VALUES ('Clinic-O', '*456', 'My Street 4', 'Clinic for all family', 1);

-- Insert data into the owner table
INSERT INTO owner (owner_id, created_date, updated_date)
VALUES (1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert data into the doctors table
INSERT INTO doctors (doctor_id, specialty, created_date, updated_date)
VALUES (3, 'Cardiologist', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert data into the patients table
INSERT INTO patients (patient_id, package, created_date, updated_date)
VALUES (2, 'Gold', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
