import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Appointment } from "../Types"; // Import the Appointment type/interface
import { useAppointments } from "./doctorAppointmentFunction";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function PatientAppointment() {
    const { state } = useLocation();
    const { getDoctordetails , startAppointment } = useAppointments();
    const patientDetails = state.patientDetails;
    const patientAppointments = state.parsedAppointments;
    const [doctorDetailsMap, setDoctorDetailsMap] = useState<Record<number, { doctorName: string, doctorSpecialty: string }>>({});

    useEffect(() => {
        if (patientAppointments) {
            patientAppointments.forEach((appointment: Appointment) => {
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
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching doctor details:", error);
                    });
            });
        }
    }, [patientAppointments]);




    return (
        <>
            <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
                {patientDetails && (
                    <div>
                        <h2>Patient Details</h2>
                        <p>Patient Name: {patientDetails.full_name}</p>
                        <p>Age: {patientDetails.age}</p>
                        <p>Packeg: {patientDetails.package}</p>
                        <p>Phone: {patientDetails.phone}</p>
                        <p>email: {patientDetails.email}</p>
                        <p>Deagnosis: {patientDetails.deagnosis || 'NONE'}</p>
                        <p>Prescriptions: {patientDetails.prescription}</p>
                    </div>
                )}
            </div>
            <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
                <h2>History Appointments</h2>
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
                        {patientAppointments && patientAppointments.map((appointment: Appointment, index: number) => (
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
                <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
                    <Button style={{width: 'fit-content'}} variant="outline-dark" onClick={()=>{startAppointment()}}>Start Appointment</Button>
                </div>
            </div>
        </>
    );
}

export default PatientAppointment;
