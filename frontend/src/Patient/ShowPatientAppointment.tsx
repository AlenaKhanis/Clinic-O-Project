import { useEffect } from "react";
import { PatientProps } from "../Types";
import { Table } from "react-bootstrap";
import { usePatient } from "./patientFunction";

function ShowPatientAppointments({ BACKEND_URL, patientId, refreshAppointments}: PatientProps) {
    const { getPatientAppointments, appointments } = usePatient();

    useEffect(() => {
        if (patientId) {
            const url = `${BACKEND_URL}/get_appointments_by_patient_id/${patientId}`;
            getPatientAppointments(url);
        }
    }, [patientId ,refreshAppointments]);

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
