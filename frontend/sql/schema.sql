DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    age INTEGER,
    full_name TEXT,  
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('owner', 'patient', 'doctor', 'pharmacy_manager')), 
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP  TABLE IF EXISTS clinic CASCADE;
CREATE TABLE IF NOT EXISTS clinic (
    id SERIAL PRIMARY KEY,
    clinic_name TEXT,
    clinic_phone TEXT,
    clinic_address TEXT,
    clinic_description TEXT,
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users (id)
);

DROP  TABLE IF EXISTS patients CASCADE;
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY, 
    package TEXT NOT NULL CHECK (package IN('premium', 'gold', 'silver')),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    patient_id INTEGER NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES users (id)
);

DROP  TABLE IF EXISTS doctors CASCADE;
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    specialuty TEXT NOT NULL,
    open_appointments TIMESTAMP,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    doctor_id INTEGER NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES users (id)
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
    id SERIAL PRIMARY KEY,
    date_time TIMESTAMP NOT NULL,
    status TEXT NOT NULL CHECK (status IN('pending', 'confirmed', 'cancelled')),
    doctor_id INTEGER NOT NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors (id),
    patient_id INTEGER NOT NULL,
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



-- Insert data into the users table first
INSERT INTO users (username, password, email, age, full_name, phone, role)
VALUES ('Alona', '1234', 'alona@mysite.com', 30, 'Alona Khanis', '05462224455', 'owner'),
    ('user', '1234', 'user@mysite.com', 25, 'user', '456445', 'patient');

-- Now, insert data into the clinic table with a valid owner_id
INSERT INTO clinic (clinic_name, clinic_phone, clinic_address, clinic_description, owner_id)
VALUES ('Clinic-O', '*456', 'My Street 4', 'Clinic for all family', 1);
