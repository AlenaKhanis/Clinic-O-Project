import { useEffect, useState } from "react";
import "../css/displayAppontments.css";
import { DoctorProps, Appointment } from '../Types';
import { Link } from "react-router-dom";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";


function DisplayAppointments({ doctorId, onAppointmentAdded }: DoctorProps) {
    const {fetchDoctorAppointments} = useDoctorAppointments();
    const [appointment , setAppointment] = useState<Appointment[]>([])


    useEffect(() => {
        if (doctorId) {
            fetchDoctorAppointments(doctorId)
                .then((data: Appointment[]) => {
                    setAppointment(data);
                })
                .catch(error => console.error('Error fetching doctor appointments:', error));
                
        }
    }, [doctorId, onAppointmentAdded]);


    return (
        <>
            <div className={`tab-content ${appointment.length > 0 ? "with-scrollbar" : ""}`}>
                <h2>Appointments</h2>
                {appointment.length > 0 ? (
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
                            {appointment.map((appointment: Appointment, index: number) => (
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
 