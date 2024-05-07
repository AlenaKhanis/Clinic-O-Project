import { useEffect } from 'react';
import '../css/displayAppontments.css';
import { useAppointments } from "./doctorAppointmentFunction";
import {DisplayAppointmentsProps} from '../Types';



function HistoryAppointments({ doctorId, onAppointmentAdded , BACKEND_URL }: DisplayAppointmentsProps) {
    const { appointments, fetchAppointments, handleViewDetails} = useAppointments();

    useEffect(() => {
        if (doctorId) {
            const url = `${BACKEND_URL}/get_appointments?doctor_id=${doctorId}`;
            fetchAppointments(url);
        }
    }, [doctorId, onAppointmentAdded]);

    // Filter appointments that have already passed
    const filteredAppointments = appointments
        .filter(appointment => {
        const [day, month, year] = appointment.date.split('/');
        const [hours, minutes, seconds] = appointment.time.split(':');

        const appointmentDateTime = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes),
            parseInt(seconds)
        );
        const currentDateTime = new Date();
        return appointmentDateTime < currentDateTime;
    })
    .filter(appointment => appointment.status === 'scedual');
    ;

    return (
        <>
            <div className={`tab-content ${filteredAppointments.length > 0 ? "with-scrollbar" : ""}`}>
                <h2>History Appointments</h2>
                {filteredAppointments.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                            
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>
                                        <button onClick={() => handleViewDetails(appointment.patient_id)}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No history appointments</p>
                )}
            </div>
            <div>
            </div>

        </>
    );
}

export default HistoryAppointments;