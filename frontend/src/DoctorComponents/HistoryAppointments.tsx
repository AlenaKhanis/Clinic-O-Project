import { useEffect, useState } from 'react';
import '../css/displayAppontments.css';
import { useAppointments } from "./doctorAppointmentFunction";
import { DisplayAppointmentsProps, Patient } from '../Types';
import { Button } from 'react-bootstrap';

function HistoryAppointments({ doctorId, onAppointmentAdded }: DisplayAppointmentsProps) {
    const { get_history_doctor_appointments, selectHistoryAppointments, getPatientById , handleViewDetails } = useAppointments();
    const [openAppointments, setOpenAppointments] = useState<{ [key: number]: boolean }>({});
    const [patient, setPatient] = useState<Patient | null>(null);

    useEffect(() => {
        if (doctorId) {
            get_history_doctor_appointments(doctorId);
        }
    }, [doctorId, onAppointmentAdded]);

    useEffect(() => {
        // Fetch patient details for each appointment
        selectHistoryAppointments.forEach(appointment => {
            getPatientById(appointment.patient_id)
                .then((patient: Patient) => {
                    setPatient(patient);
                })
                .catch(error => console.error("Error fetching patient details:", error));
        });
    }, [selectHistoryAppointments]);

    const toggleAppointmentDetails = (appointmentId: number) => {
        setOpenAppointments(prevState => ({
            ...prevState,
            [appointmentId]: !prevState[appointmentId]
        }));
    };

    return (
        <>
            <div className={`tab-content ${selectHistoryAppointments.length > 0 ? "with-scrollbar" : ""}`}>
                <h2>History Appointments</h2>
                {selectHistoryAppointments.length > 0 ? (
                    <table>
                        <tbody>
                            {selectHistoryAppointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>Date: {appointment.date}</td>
                                    <td>Time: {appointment.time}</td>
                                    <td>
                                    <Button onClick={() => handleViewDetails(appointment.patient_id , appointment.id)} style={{cursor: 'pointer' }}>
                                        Patient: {patient ? patient.full_name : 'Loading...'}
                                    </Button>
                                    </td>
                                    <td>
                                        <Button
                                            onClick={() => toggleAppointmentDetails(appointment.id)}
                                            aria-controls={`appointment-details-${appointment.id}`}
                                            aria-expanded={openAppointments[appointment.id]}
                                        >
                                            {openAppointments[appointment.id] ? 'Hide Details' : 'Show Appointment Details'}
                                        </Button>
                                    </td>
                                    <td>
    
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No history appointments</p>
                )}
            </div>
            {selectHistoryAppointments.map((appointment, index) => (
            <div key={`details-${index}`} style={{ display: openAppointments[appointment.id] ? 'block' : 'none' }}>
                <p>
                    <span style={{ fontWeight: 'bold' }}>Summary:</span> {appointment.summery}
                </p>
                <p>Writen_diagnosis: {appointment.writen_diagnosis}</p>
                <p>Writen_prescription: {appointment.writen_prescription}</p>
            </div>
        ))}
        </>
    );
}    

export default HistoryAppointments;
