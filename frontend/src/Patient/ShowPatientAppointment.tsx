import { useEffect, useState } from "react";
import { PatientProps, Appointment } from "../UserTypes";
import { Table } from "react-bootstrap";

function ShowPatientAppointments({ BACKEND_URL, patientId }: PatientProps) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        if (patientId) {
            getPatientAppointments();
        }
    }, [patientId]);

    const getPatientAppointments = () => {
        fetch(`${BACKEND_URL}/get_appointments_by_patient_id/${patientId}`)
            .then(response => response.json())
            .then(data => {
                setAppointments(data);
            })
            .catch(error => {
                console.error("Error fetching appointments:", error);
            });
    };

    return (
        <>
            {appointments.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            {/* Add more table headers if needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                {/* Add more table data cells for other appointment details */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (                  
                <div>
                    <h1>No future appointments</h1>
                </div>
            )}
        </>
    );
    
    
}

export default ShowPatientAppointments;
