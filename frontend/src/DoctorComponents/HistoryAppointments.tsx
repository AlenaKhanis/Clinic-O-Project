import { useEffect, useState } from 'react';
import '../css/displayAppontments.css';
import { Appointment, DoctorProps, Patient } from '../Types';
import { Button, Collapse, Table } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import { usePatientDetails } from '../useFunctions/usePatientDetails';
import React from 'react';

function HistoryAppointments({ doctorId, onAppointmentAdded }: DoctorProps) {
    const { getHistoryDoctorAppointments} = useDoctorAppointments();
    const {getPatientById} = usePatientDetails();
    const [openAppointments, setOpenAppointments] = useState<{ [key: number]: boolean }>({}); //TODO: ----?
    const [patient, setPatient] = useState<Patient>();
    const [selectHistoryAppointments , setSelectHistoryAppointments] = useState<Appointment[]>([]);
    

    useEffect(() => {
        if (doctorId) {
            getHistoryDoctorAppointments(doctorId)
                .then((appointments: Appointment[]) => {
                    setSelectHistoryAppointments(appointments);
                })
                .catch(error => console.error("Error fetching patient history appointments:", error));
        }
    }, [doctorId, onAppointmentAdded]);

   useEffect(() => {
    // Create a unique set of patient IDs
    const patientIds = new Set(selectHistoryAppointments.map(appointment => appointment.patient_id));
    console.log(patientIds);

    patientIds.forEach(id => {
        getPatientById(id)
            .then((patient: Patient) => {
                setPatient(patient);
            })
    });
}, [selectHistoryAppointments]);

    const toggleAppointmentDetails = (appointmentId: number) => {
        setOpenAppointments(prevState => ({
            ...prevState,
            [appointmentId]: !prevState[appointmentId]
        }));
    };

    return (
            <div className={`tab-content ${selectHistoryAppointments.length > 0 ? "with-scrollbar" : ""}`}>
                <h2>History Appointments</h2>
                {selectHistoryAppointments.length > 0 ? (
                    <Table>
                        <tbody>
                            {selectHistoryAppointments.map(appointment => (
                                <React.Fragment key={appointment.id}>
                                    <tr>
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
                                        <tr>
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
                                    </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <p>No history appointments</p>
                )}
            </div>
    );
    
};
export default HistoryAppointments;
