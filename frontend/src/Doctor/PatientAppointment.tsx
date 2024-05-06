import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Appointment } from "../Types"; // Import the Appointment type
import { useAppointments } from "./doctorAppointmentFunction";
import { Button } from "react-bootstrap";
import '../css/Tabs.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function PatientAppointment() {
    const { state } = useLocation();
    const { getDoctordetails , startAppointment } = useAppointments();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    //TODO: check how it work -> useState<Record<number, { doctorName: string, doctorSpecialty: string }>>({});
    const [doctorDetailsMap, setDoctorDetailsMap] = useState<Record<number, { doctorName: string, doctorSpecialty: string }>>({});

    useEffect(() => {
        if (state?.parsedAppointments) {
            setAppointments(state.parsedAppointments);
            

            state.parsedAppointments.forEach((appointment: Appointment) => {
                getDoctordetails(BACKEND_URL, appointment.doctor_id)
                    .then(doctor => {
                        if (doctor) {
                            setDoctorDetailsMap(prevMap => ({
                                ...prevMap,
                                [appointment.doctor_id]: {
                                    doctorName: doctor.full_name,
                                    doctorSpecialty: doctor.specialty
                                }
                                
                            }));
                          console.log(appointments)
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching doctor details:", error);
                    });
            });
        }
    }, [state?.parsedAppointments]);

    return (
        <>
        <div><h1>Patient Appointment</h1></div>
            <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Summary</th>
                            <th>Written Diagnosis</th>
                            <th>Written Prescriptions</th>
                            <th>Doctor Name</th>
                            <th>Doctor Specialty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.summery || "None"}</td>
                                <td>{appointment.written_diagnosis || "None"}</td>
                                <td>{appointment.written_prescriptions || "None"}</td>
                                <td>{doctorDetailsMap[appointment.doctor_id]?.doctorName || "Unknown"}</td>
                                <td>{doctorDetailsMap[appointment.doctor_id]?.doctorSpecialty || "Unknown"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div>
                    <Button style={{width: 'fit-content'}} variant="outline-dark" onClick={()=>{startAppointment()}}>Start Appointment</Button>
                </div>
            </div>
        </>
    );
}

export default PatientAppointment;
