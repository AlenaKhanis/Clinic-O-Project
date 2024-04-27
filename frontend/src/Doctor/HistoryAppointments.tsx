import { useEffect } from 'react';
import '../css/displayAppontments.css';
import { useAppointments } from "./appointmentsFunction";
import {DisplayAppointmentsProps} from '../UserTypes';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function HistoryAppointments({ doctorId, onAppointmentAdded }: DisplayAppointmentsProps) {
    const { appointments, fetchAppointments, handleViewDetails, selectedPatientDetails, setSelectedPatientDetails } = useAppointments();

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

        // Construct a new Date object
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
    });

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
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment, index) => (
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
                    <p>No history appointments</p>
                )}
            </div>
            <div>
               
                {selectedPatientDetails && (
                     //TODO: more css 
                    <div className="appointment-details">
                        <h3>Appointment Details</h3>
                        <p>Name: {selectedPatientDetails.full_name}</p>
                        <p>Age: {selectedPatientDetails.age}</p>
                        <p>Package: {selectedPatientDetails.package}</p>
                        <p>Phone: {selectedPatientDetails.phone}</p>
                        <p>Email: {selectedPatientDetails.email}</p>
                        <p>Diagnoses: {selectedPatientDetails.diagnosis}</p>
                        <p>Prescription: {selectedPatientDetails.prescription}</p>
                        <div><p>Summary visit:</p><input/></div>
                        <div><p>Add Diagnoses:</p><input/></div>
                        <div><p>Add Prescription:</p><input /></div>
                        <button>Save</button>
                    </div>
                )}
            </div>

        </>
    );
}

export default HistoryAppointments;