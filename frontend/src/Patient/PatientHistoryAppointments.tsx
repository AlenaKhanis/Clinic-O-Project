import React, { useEffect, useState } from "react";
import { usePatientDetails } from "../useFunctions/usePatientDetails";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";

import { Appointment, Doctor} from "../Types";
import { Button, Collapse, Table } from 'react-bootstrap';

import "../css/IndividualAppointmentDetails.css";

/**
 * IndividualAppointmentDetails component
 * isplay detailed information about historical appointments for a specific patient.
 *  It fetches and renders appointment data, including summary, diagnosis, prescription, and associated doctor details
 *
 */


function IndividualAppointmentDetails({ patientId, refreshAppointments }: {patientId: number | null , refreshAppointments: () => void }) {
    const [selectHistoryAppointments, setSelectHistoryAppointments] = useState<Appointment[]>([]);
    const [doctors, setDoctors] = useState<{ [key: number]: Doctor }>({});
    const [openAppointments, setOpenAppointments] = useState<{ [key: number]: boolean }>({});

    const { getPatientHistoryAppointments } = usePatientDetails();
    const { getDoctorById } = useDoctorAppointments();

    const toggleAppointmentDetails = (id: number) => {
        setOpenAppointments(prevState => ({ ...prevState, [id]: !prevState[id] }));
    };

    useEffect(() => {
        if (patientId) {
            getPatientHistoryAppointments(patientId)
                .then((data: Appointment[]) => { 
                    setSelectHistoryAppointments(data);
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
        <div className="content-container">
            <h2>History Appointments</h2>
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
                                            className="toggle-appointment-details-button"
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
                                        <Collapse in={openAppointments[appointment.id]}  className="collapse-content">
                                            <div id={`appointment-details-${appointment.id}`}>
                                                <p><span>Summary:</span> {appointment.summary}</p>
                                                <p><span>Written Diagnosis:</span> {appointment.written_diagnosis}</p>
                                                <p><span>Written Prescription:</span> {appointment.written_prescription}</p>
                                                <p><span>Doctor:</span> {doctors[appointment.doctor_id] ? doctors[appointment.doctor_id].full_name : 'Loading...'}</p>
                                                <p><span>Specialty:</span> {doctors[appointment.doctor_id] ? doctors[appointment.doctor_id].specialty : 'Loading...'}</p>
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

export default IndividualAppointmentDetails;
