-- Drop existing tables if they exist
DROP TABLE IF EXISTS appointments CASCADE;
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
    role TEXT NOT NULL CHECK (role IN ('owner', 'patient', 'doctor', 'pharmacy_manager')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the patients table
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER UNIQUE NOT NULL, 
    package TEXT NOT NULL CHECK (package IN ('Premium', 'Gold', 'Silver')) DEFAULT 'Silver',
    prescription TEXT[] DEFAULT '{}',
    diagnosis TEXT[] DEFAULT '{}',
    FOREIGN KEY (patient_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Create the doctors table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER UNIQUE NOT NULL,
    specialty TEXT NOT NULL DEFAULT '',
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

-- Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER,
    date_time TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('schedule', 'cancelled', 'open', 'completed')),
    doctor_id INTEGER NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors (doctor_id) ON DELETE CASCADE,
    FOREIGN KEY (patient_id) REFERENCES patients (patient_id) ON DELETE CASCADE
);

-- Create the owner table
CREATE TABLE IF NOT EXISTS owner (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
);
