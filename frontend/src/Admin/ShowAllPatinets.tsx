import { useEffect, useState } from "react";
import { Patient } from "../Types";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useBackendUrl } from '../BackendUrlContext';

export default function ShowAllPatients({onPatientAdded} : {onPatientAdded : boolean}) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const BACKEND_URL = useBackendUrl();

    useEffect(() => {
        fetch(`${BACKEND_URL}/get_patients`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: Patient[]) => {
                setPatients(data);
            })
            .catch(error => {
                console.error("Error fetching patient details:", error);
            });
    }, [onPatientAdded]);

    return (
        <div className='doctor-patients-container'>
          <div className='patient-sidebar' style={{ width: '100%' }}>
            <h1>All Patients</h1>
            {patients.length === 0 ? (
              <p>No patients</p>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(patient => (
                    <tr key={patient.id}>
                      <td>{patient.id}</td>
                      <td>
                        <Link to={`/admin/patient_detail/${patient.patient_id}`}>{patient.full_name}</Link>
                      </td>
                      <td>{patient.age}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      );
}
