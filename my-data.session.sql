 SELECT DISTINCT p.*, u.username, u.full_name, u.age, u.email, u.phone 
                    FROM patients p
                    INNER JOIN users u ON u.id = p.patient_id              
                    WHERE p.id = 2;

