
SELECT DISTINCT p.*, u.username, u.email, u.age, u.full_name, u.phone, u.role
FROM patients p
INNER JOIN users u ON u.id = p.patient_id
WHERE u.id = 2;

