SELECT
    u.id AS id,
    u.username,
    u.email,
    u.age,
    u.full_name,
    u.phone,
    u.role,
    p.package AS patient_package,
    d.specialuty AS doctor_specialty
FROM
    users u
LEFT JOIN
    patients p ON u.id = p.patient_id
LEFT JOIN
    doctors d ON u.id = d.doctor_id
WHERE

    p.patient_id = (patient_id)
    OR d.doctor_id = (doctor_id);
