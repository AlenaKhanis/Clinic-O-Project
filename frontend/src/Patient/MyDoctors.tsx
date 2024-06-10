import { useEffect, useState } from "react";
import { Doctor, PatientProps } from "../Types";

//TODO: when no doctors are found, display a message to the user

function MyDoctors({BACKEND_URL , patientId, refreshAppointments }: PatientProps) {
    const [doctor, setdoctor] = useState<Doctor[]>([]);
    
    useEffect(() => {
        if (patientId) {
        const fetchPatients = () => {
        fetch(`${BACKEND_URL}/get_patient_doctors/${patientId}`)
          .then(response => response.json())
          .then(data => {
    
            setdoctor(data);
         
          })
          .catch(error => {
            console.error("Error fetching patients:", error);
         
            });
        };
        fetchPatients();
        }
      }, [patientId , refreshAppointments]);


      return (
        <div>
          <h1>My Doctors</h1>
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
                <td>{doctor.full_name}</td>
                <td>{doctor.age}</td>
                <td>{doctor.email}</td>
                <td>{doctor.phone}</td>
                <td>{doctor.specialty}</td>
                </tr>
            ))}
            </tbody>
            </table>
            </div>
            );

};

export default MyDoctors;