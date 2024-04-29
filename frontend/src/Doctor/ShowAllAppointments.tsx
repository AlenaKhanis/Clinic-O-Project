import{ useEffect } from "react";
import "../css/displayAppontments.css";
import { useAppointments } from "./appointmentsFunction";
import {DisplayAppointmentsProps} from '../UserTypes';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;



function DisplayAppointments({ doctorId, onAppointmentAdded }: DisplayAppointmentsProps) {
    const { appointments, fetchAppointments, handleViewDetails, selectedPatientDetails  , setSelectedPatientDetails , filteredAppointments} = useAppointments();


    useEffect(() => {
        if (doctorId) {
            const url = `${BACKEND_URL}/get_appointments?doctor_id=${doctorId}`;
            fetchAppointments(url);
        }
    }, [doctorId, onAppointmentAdded]);


// Filter appointments based on date and time

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
                            {filteredAppointments
                                .sort((a, b) => {
                                    const dateA = new Date(`${a.date} ${a.time}`).getTime();
                                    const dateB = new Date(`${b.date} ${b.time}`).getTime();
                                    return dateA - dateB;
                                })
                                
                                .map((appointment, index) => (
                                    <tr key={index}>
                                        <td>{appointment.date}</td>
                                        <td>{appointment.time}</td>
                                        <td>{appointment.status}</td>
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
                    <p>No appointments</p>
                )}
            </div>
            <div>
                //TODO: check why not close when clicking on button with patient iSd null
            {selectedPatientDetails && (
                <div>
                    <h3>Appointment Details</h3>
                    <p>Name: {selectedPatientDetails.full_name}</p>
                    <p>Diagnoses: {selectedPatientDetails.diagnosis}</p>
                    <p>Prescription: {selectedPatientDetails.prescription}</p>
                </div>
            )}

            </div>
        </>
    );
}    

export default DisplayAppointments;
