import { useEffect, useState } from "react";
import { DoctorProps, Patient } from "../Types";
import { Link } from "react-router-dom";

//TODO: add css

function AllPatientView({ doctorId, BACKEND_URL }: DoctorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (doctorId) {
      const fetchPatients = () => {
        fetch(`${BACKEND_URL}/get_doctor_patients/${doctorId}`)
          .then((response) => response.json())
          .then((data) => {
            setPatients(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching patients:", error);
            setLoading(false);
          });
      };
      fetchPatients();
    }
  }, [doctorId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>All Patients</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>
                <Link to={`patient_detail/${patient.patient_id}`}>{patient.full_name}</Link>
              </td>
              <td>{patient.age}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllPatientView;

