import { useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Appointment } from "../Types";
import { useAppointments } from "./doctorAppointmentFunction";
import '../css/AppointmentSummeryForm.css';
import '../css/Tabs.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function PatientAppointment() {
    const { state } = useLocation();
    const { getDoctordetails, startAppointment, handleSubmit } = useAppointments();
    const patientDetails = state?.patientDetails;
    const patientAppointments = state?.parsedAppointments;
    const [doctorDetailsMap, setDoctorDetailsMap] = useState<Record<number, { doctorName: string, doctorSpecialty: string }>>({});
    const [showForm, setShowForm] = useState(false);
    const summaryRef = useRef<HTMLTextAreaElement>(null);
    const diagnosisRef = useRef<HTMLInputElement>(null);
    const prescriptionRef = useRef<HTMLInputElement>(null);

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

    const handleStartAppointment = () => {
        startAppointment();
        setShowForm(true);
    };

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
                {!showForm && (
                    <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
                        <Button style={{ width: 'fit-content' }} variant="outline-dark" onClick={handleStartAppointment}>Start Appointment</Button>
                    </div>
                )}
                {showForm && (
                    <div className="containerSummery">
                        <form>
                            <div className="row">
                                <div className="col-25">
                                    <label className="lableSummery">Diagnosis</label>
                                </div>
                                <div className="col-75">
                                    <input type="text" id="summary" name="summary" placeholder="Diagnosis.." ref={diagnosisRef} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-25">
                                    <label className="lableSummery">Prescription</label>
                                </div>
                                <div className="col-75">
                                    <input type="text" id="lname" name="lastname" placeholder="Prescription.." ref={prescriptionRef} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-25">
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-25">
                                    <label className="lableSummery">Summary</label>
                                </div>
                                <div className="col-75">
                                    <textarea id="subject" name="subject" placeholder="Write summary.." ref={summaryRef}></textarea>
                                </div>
                            </div>
                            <div className="row">
                                <Button className="sendButton" variant="outline-dark" type="button" onClick={() => handleSubmit(summaryRef, diagnosisRef, prescriptionRef)}>End Appointment</Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default PatientAppointment;
