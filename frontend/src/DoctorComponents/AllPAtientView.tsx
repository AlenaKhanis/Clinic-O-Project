import { useEffect, useState } from "react";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";
import { DoctorProps, Patient } from "../Types";
import { Link } from "react-router-dom";

import '../css/allPatientView.css';


/**
 * AllPatientView component
 * Displays a list of all patients associated with a specific doctor.
 **/

function AllPatientView({ doctorId }: DoctorProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {getDoctorPatients} = useDoctorAppointments();
  

  useEffect(() => {
    if (doctorId) {
      getDoctorPatients(doctorId)
          .then((data) => {
            setPatients(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching patients:", error);
            setLoading(false);
          });
      };
  }, [doctorId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-container">
      <h1>All Patients</h1>
      {patients.length === 0 ? (
        <p>No patients yet</p>
      ) : (
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
      )}
    </div>
  );
}

export default AllPatientView;

