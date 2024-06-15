import { useEffect, useState } from "react";
import { Appointment, Doctor, PatientProps } from "../Types";
import { Button, Collapse, Table } from 'react-bootstrap';
import { usePatientDetails } from "../useFunctions/usePatientDetails";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";
import React from "react";

function PatientHistoryAppointments({ patientId, refreshAppointments }: PatientProps & { refreshAppointments: () => void }) {
    const [selectHistoryAppointments, setSelectHistoryAppointments] = useState<Appointment[]>([]);
    const { getPatientHistoryAppointments } = usePatientDetails();
    const { getDoctorById } = useDoctorAppointments();
    const [doctors, setDoctors] = useState<{ [key: number]: Doctor }>({});
    const [openAppointments, setOpenAppointments] = useState<{ [key: number]: boolean }>({});

    const toggleAppointmentDetails = (id: number) => {
        setOpenAppointments(prevState => ({ ...prevState, [id]: !prevState[id] }));
    };

    useEffect(() => {
        if (patientId) {
            getPatientHistoryAppointments(patientId)
                .then((data: Appointment[]) => { 
                    setSelectHistoryAppointments(data);
                    // Fetch doctors for each appointment
                    const doctorIds = data.map(appointment => appointment.doctor_id);
                    const uniqueDoctorIds = Array.from(new Set(doctorIds));
                    uniqueDoctorIds.forEach(doctorId => {
                        getDoctorById(doctorId)
                            .then((doctor: Doctor) => {
                                setDoctors(prevState => ({ ...prevState, [doctorId]: doctor }));
                            })
                            .catch(error => console.error("Error fetching doctor details:", error));
                    });
                });
        }
    }, [patientId, refreshAppointments]);

    return (
        <div>
            {selectHistoryAppointments.length > 0 ? (
                <Table>
                    <tbody>
                        {selectHistoryAppointments.map((appointment) => (
                            <React.Fragment key={appointment.id}>
                                <tr>
                                    <td>Date: {appointment.date}</td>
                                    <td>Time: {appointment.time}</td>
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
                                    <td colSpan={3}>
                                        <Collapse in={openAppointments[appointment.id]}>
                                            <div id={`appointment-details-${appointment.id}`}>
                                                <p><span style={{ fontWeight: 'bold' }}>Summary:</span> {appointment.summery}</p>
                                                <p>Written Diagnosis: {appointment.writen_diagnosis}</p>
                                                <p>Written Prescription: {appointment.writen_prescription}</p>
                                                <p>Doctor: {doctors[appointment.doctor_id] ? doctors[appointment.doctor_id].full_name : 'Loading...'}</p>
                                                <p>Specialty: {doctors[appointment.doctor_id] ? doctors[appointment.doctor_id].specialty : 'Loading...'}</p>
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
}

export default PatientHistoryAppointments;
