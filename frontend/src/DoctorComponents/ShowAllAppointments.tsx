import { useEffect, useState } from "react";
import "../css/displayAppontments.css";
import { DoctorProps, Appointment } from '../Types';
import { Link } from "react-router-dom";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";

//TODO: add delete appointment functionality


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

    const filteredAppointments = appointment
  .filter(appointment => {
    const appointmentDateTime = new Date(appointment.date_time);
    const currentDateTime = new Date();

    // Check if the constructed date object is valid
    if (!isNaN(appointmentDateTime.getTime())) {
      const isFuture = appointmentDateTime > currentDateTime;
      const isNotCompleted = appointment.status !== 'completed';
      return isFuture && isNotCompleted;
    } else {
      console.error('Invalid date:', appointment.date_time);
      return false; // or handle this case differently
    }
  })
  .sort((a, b) => {
    const dateA = new Date(a.date_time).getTime();
    const dateB = new Date(b.date_time).getTime();
    
    return dateA - dateB;
  });



    return (
        <>
            <div className={`tab-content ${filteredAppointments.length > 0 ? "with-scrollbar" : ""}`}>
                <h2>Appointments</h2>
                {filteredAppointments.length > 0 ? (
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
 