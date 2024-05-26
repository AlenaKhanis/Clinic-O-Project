import { useEffect } from "react";
import "../css/displayAppontments.css";
import { useAppointments } from "./doctorAppointmentFunction";
import { DoctorProps, Appointment } from '../Types';
import { Link } from "react-router-dom";


function DisplayAppointments({ doctorId, onAppointmentAdded }: DoctorProps) {
    const { appointments, fetchDoctorAppointments, filteredAppointments  } = useAppointments();


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
                                            <Link to={`start_appointment/${appointment.patient_id}/${appointment.id}`} style={{ width: 'fit-content' }} className="btn btn-outline-dark">
                                             Start Appointment
                                           </Link>
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
 