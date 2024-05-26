import { useEffect, useState } from 'react';
import '../css/displayAppontments.css';
import { useAppointments } from "./doctorAppointmentFunction";
import { DoctorProps, Patient } from '../Types';
import { Button, Collapse } from 'react-bootstrap';
import { Link } from "react-router-dom";

function HistoryAppointments({ doctorId, onAppointmentAdded }: DoctorProps) {
    const { get_history_doctor_appointments, selectHistoryAppointments, getPatientById } = useAppointments();
    const [openAppointments, setOpenAppointments] = useState<{ [key: number]: boolean }>({}); //TODO: ----?
    const [patient, setPatient] = useState<Patient>();

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
                    <>
                        <table>
                        <tbody>
                            {selectHistoryAppointments.map(appointment => (
                                <>
                                    <tr key={appointment.id}>
                                        <td>Date: {appointment.date}</td>
                                        <td>Time: {appointment.time}</td>
                                        <td>
                                            {patient && (
                                                <Link to={`patient_detail/${appointment.patient_id}`}>
                                                    Patient: {patient.full_name}
                                                </Link>
                                            )}
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
                                    </tr>
                                    <tr key={`details-${appointment.id}`}>
                                        <td colSpan={4}>
                                            <Collapse in={openAppointments[appointment.id]}>
                                                <div>
                                                    <p>Summary: {appointment.summery}</p>
                                                    <p>Written Diagnosis: {appointment.writen_diagnosis}</p>
                                                    <p>Written Prescription: {appointment.writen_prescription}</p>
                                                </div>
                                            </Collapse>
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                    </>
                ) : (
                    <p>No history appointments</p>
                )}
            </div>
        </>
    );
    
};
export default HistoryAppointments;
