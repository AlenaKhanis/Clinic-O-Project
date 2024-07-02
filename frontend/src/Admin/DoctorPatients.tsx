import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';

import { Patient } from '../Types';

import { Table } from 'react-bootstrap';


/**
 * DoctorPatients Component:
 * 
 * This component fetches and displays a list of patients for a specific doctor.
 * It renders a table with columns for patient's package, full name, age, email, and phone.
 * Each patient's full name is linked to their individual patient detail page using React Router's Link component.
 */

function DoctorPatients({ doctorId }: { doctorId: number}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { getDoctorPatients } = useDoctorAppointments();


  useEffect(() => {
    if (doctorId) {
      getDoctorPatients(doctorId)
        .then((data: Patient[]) => {
          setPatients(data);
        })
        .catch((error) => {
          console.error('Error fetching doctor patients:', error);
        });
    }
  }, [doctorId]);

  return (
    <div>
      <h1>Doctor's Patients</h1>
      {patients.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Package</th>
              <th>Full Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.package}</td>
                <td>
                  <Link to={`../patient_detail/${patient.patient_id}`}>{patient.full_name}</Link>
                </td>
                <td>{patient.age}</td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>This doctor doesn't have any patients yet.</p>
      )}
    </div>
  );
}

export default DoctorPatients;
