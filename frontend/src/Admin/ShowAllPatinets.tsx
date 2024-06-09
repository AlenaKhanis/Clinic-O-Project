import { useEffect, useState } from "react";
import { OwnerProps, Patient } from "../Types";

export default function ShowAllPatients(BACKEND_URL: OwnerProps) {
    const [patient , setPatient] = useState<Patient[]>([]);


    useEffect(() => {
        console.log('fetching all patients');
        fetch(`${BACKEND_URL}/get_all_patients`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: Patient[]) => {
                setPatient(data);
            })
            .catch(error => {
                console.error("Error fetching patient details:", error);
            });
    }, []);

    console.log(patient);   

    return (
        <div className='doctor-patients-container'>
        <div className='patient-sidebar'>
          <h1>All Patient</h1>
        </div>
      </div>
    );
}