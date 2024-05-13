import { useEffect } from "react";
import "../css/displayAppontments.css";
import { useAppointments } from "./doctorAppointmentFunction";
import { DisplayAppointmentsProps, Appointment } from '../Types';
import { Button } from "react-bootstrap";


function DisplayAppointments({ doctorId, onAppointmentAdded }: DisplayAppointmentsProps) {
    const { appointments, fetchDoctorAppointments, handleViewDetails, filteredAppointments } = useAppointments();

    useEffect(() => {
        if (doctorId) {
            fetchDoctorAppointments(doctorId);
        }
    }, [doctorId, onAppointmentAdded]);

    return (
        <>
            <div className={`tab-content ${appointments.length > 0 ? "with-scrollbar" : ""}`}>
                <h2>Appointments</h2>
                {appointments.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment: Appointment, index: number) => (
                                <tr key={index}>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        {appointment.status === 'schedule' && (
                                            <Button style={{ width: 'fit-content' }} variant="outline-dark" onClick={() => handleViewDetails(appointment.patient_id, appointment.id)}>
                                                View Details
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No appointments</p>
                )}
            </div>
        </>
    );
}

export default DisplayAppointments;
 