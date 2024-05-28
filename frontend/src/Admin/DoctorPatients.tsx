import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { Patient } from '../Types';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import { Table } from 'react-bootstrap';

function DoctorPatients({ doctorId }: { doctorId: number }) {
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
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Package</th>
            <th>Full Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Created date</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.package}</td>
              <td>
                <Link to={`/doctor/patient_detail/${patient.patient_id}`}>{patient.full_name}</Link> 
              </td>
              <td>{patient.age}</td>
              <td>{patient.email}</td>
              <td>{patient.phone}</td>
              <td>{new Date(patient.created_date).toLocaleString()}</td> //TODO: check if same date like in the backend
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DoctorPatients;
