import { useEffect, useState } from 'react';
import { useBackendUrl } from '../BackendUrlContext';
import { Link } from 'react-router-dom';

import { Doctor } from '../Types';

import { Table } from 'react-bootstrap';

/**
 * DoctorsList Component:
 * 
 * This component fetches and displays a list of doctors from the backend.
 * It renders a table with columns for doctor's name, specialty, email, and phone.
 * Each doctor's name is linked to their individual profile page using React Router's Link component.
 */


function DoctorsList({ onDoctorAdded }: {onDoctorAdded : boolean}) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const BACKEND_URL = useBackendUrl();
  
  useEffect(() => {
    fetch(`${BACKEND_URL}/doctors`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Doctor[]) => {
        setDoctors(data);
      })
      .catch((error) => {
        console.error('Error fetching doctors:', error);
      });
  }, [onDoctorAdded]);

  return (
    <div>
      <h1>Doctors List</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialty</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doctor => (
            <tr key={doctor.doctor_id}>
              <td><Link to={`doctor-profile/${doctor.doctor_id}`}>{doctor.full_name}</Link></td>
              <td>{doctor.specialty}</td>
              <td>{doctor.email}</td>
              <td>{doctor.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DoctorsList;
