import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Appointment } from "../Types"; // Import the Appointment type

function PatientAppointment() {
    const { state } = useLocation();

    const parsedAppointments: Appointment[] = state?.parsedAppointments || []; // Define the type for patientAppointments

    return (
        <>
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Summery</th>
                            <th>Written Diagnosis</th>
                            <th>Written Prescriptions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {parsedAppointments.map((appointment , index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.summery}</td>
                                <td>{appointment.written_diagnosis}</td>
                                <td>{appointment.written_prescriptions}</td>
                                {/* Add more table data as needed */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </>
    );
}

export default PatientAppointment;
