import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Doctor} from "../Types";
import { useBackendUrl } from "../BackendUrlContext";

/**
 * MyDoctors component
 * displaying a list of doctors associated with a specific patient
 */


function MyDoctors({ patientId, isOwner }: {patientId : number | null , isOwner: boolean }) {
    const [doctor, setDoctor] = useState<Doctor[]>([]);

    const BACKEND_URL = useBackendUrl();

    useEffect(() => {
        if (patientId) {
            const fetchPatients = () => {
                fetch(`${BACKEND_URL}/get_patient_doctors/${patientId}`)
                    .then(response => response.json())
                    .then(data => {
                        setDoctor(data);
                    })
                    .catch(error => {
                        console.error("Error fetching doctors:", error);
                    });
            };
            fetchPatients();
        }
    }, [patientId]);

    return (
        <div>
            <h1>Patient Doctors</h1>
            {doctor.length === 0 ? (
                <p>No doctors found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Specialty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctor.map((doctor) => (
                            <tr key={doctor.id}>
                                <td>
                                    {isOwner ? (
                                        <Link to={`/admin/doctor-profile/${doctor.doctor_id}`}>{doctor.full_name}</Link>
                                    ) : (
                                        doctor.full_name
                                    )}
                                </td>
                                <td>{doctor.age}</td>
                                <td>{doctor.email}</td>
                                <td>{doctor.phone}</td>
                                <td>{doctor.specialty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MyDoctors;
