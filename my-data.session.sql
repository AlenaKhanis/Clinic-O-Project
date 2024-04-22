INSERT INTO patients (
    patient_id,
    package,
    created_date,
    updated_date
)
VALUES (
    2,  -- Replace with the valid patient_id from the users table
    'Gold',
    CURRENT_TIMESTAMP,  -- Set the created_date to the current timestamp
    CURRENT_TIMESTAMP  -- Set the updated_date to the current timestamp
);
