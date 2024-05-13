import { useEffect, useRef, useState } from "react";
import { Alert, Button, ListGroup, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { Appointment, Doctor } from "../Types";
import { useAppointments } from "./doctorAppointmentFunction";
import '../css/AppointmentSummeryForm.css';
import '../css/Tabs.css';
import Collapse from 'react-bootstrap/Collapse';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function PatientAppointment() {
    const { state } = useLocation();
    const { getDoctordetails, handleSubmit , fetchDoctorAppointments , appointments} = useAppointments();
    const patientDetails = state?.patientDetails;
    const patientAppointments = state?.parsedAppointments;
    const appointmentID = state?.appointmentId;
    const [doctorDetailsMap, setDoctorDetailsMap] = useState<Record<number, { doctorName: string, doctorSpecialty: string }>>({});
    const [showForm, setShowForm] = useState(false);
    const summaryRef = useRef<HTMLTextAreaElement>(null);
    const diagnosisRef = useRef<HTMLInputElement>(null);
    const prescriptionRef = useRef<HTMLInputElement>(null);
    const [appointmentEnded, setAppointmentEnded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccsses, setShowSuccsses] = useState(false);
    const [open, setOpen] = useState(false);
    const doctorID = patientAppointments[0].doctor_id;
    const [colusion , setColusion] = useState(false)

    useEffect(() => {
        if (patientAppointments) {
            // Create a set to store unique doctor IDs
            const uniqueDoctorIds = new Set<number>();
            patientAppointments.forEach((appointment: Appointment) => {
                // Add the doctor ID to the set
                uniqueDoctorIds.add(appointment.doctor_id);
            });
    
            // Iterate through unique doctor IDs and fetch their details
            uniqueDoctorIds.forEach((doctorId: number) => {
                getDoctordetails(BACKEND_URL, doctorId)
                    .then((doctor: Doctor) => {
                        if (doctor) {
                            setDoctorDetailsMap(prevMap => ({
                                ...prevMap,
                                [doctorId]: {
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
    

    useEffect(() => {
        fetchDoctorAppointments(doctorID)
    },[doctorID])


    const handleStartAppointment = () => {

            const currentDate = new Date();
            const endTime = new Date(currentDate.getTime() + 15 * 60000); // 15 minutes from current time
            const isWithin15Minutes = appointments.some(appointment =>
                appointment.id !== appointmentID &&
                (
                    (endTime.getTime() >= new Date(appointment.date_time).getTime() && endTime.getTime() <= new Date(appointment.date_time).getTime() + 15 * 60000) ||
                    (currentDate.getTime() >= new Date(appointment.date_time).getTime() && currentDate.getTime() <= new Date(appointment.date_time).getTime() + 15 * 60000)
                )
            );
    
            if (isWithin15Minutes) {
                setColusion(true);
            } else {
                setShowForm(true);

            }
        };
    
    
    

    const handleEndAppointment = () => {
        const summary = summaryRef.current?.value;
        if (!summary) {
            setShowAlert(true);
            return;
        }
        handleSubmit(summaryRef, diagnosisRef, prescriptionRef, appointmentID, patientDetails?.patient_id);
        setShowForm(false);
        setAppointmentEnded(true);
        setShowSuccsses(true);
    }


    const appointmentToStart = appointments.find(appointment => appointment.id === appointmentID);
    let appointmentDate: Date | null = null;
    if (appointmentToStart && appointmentToStart.date_time) {
        appointmentDate = new Date(appointmentToStart.date_time);
    }
    const today = new Date();
    const isTodayAppointment = appointmentDate !== null &&
                            appointmentDate.getDate() === today.getDate() &&
                            appointmentDate.getMonth() === today.getMonth() &&
                            appointmentDate.getFullYear() === today.getFullYear();


    return (
        <>
           
            <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
            {appointmentEnded && <Alert variant="success" show={showSuccsses} onClose={() => setShowSuccsses(false) } dismissible>Appointment has ended.</Alert>}
           {patientDetails && (
                    <div>
                        <h2>Patient Details</h2>
                        <p>Patient Name: {patientDetails.full_name}</p>
                        <p>Age: {patientDetails.age}</p>
                        <p>Packeg: {patientDetails.package}</p>
                        <p>Phone: {patientDetails.phone}</p>
                        <p>Email: {patientDetails.email}</p>
                        <div>
                            <p>Diagnosis:</p>
                            {patientDetails.deagnosis && patientDetails.deagnosis.length > 0 ? (
                                <ListGroup as="ol" numbered >
                                    {patientDetails.deagnosis.map((diagnosis: string, index: number) => (
                                        <ListGroup.Item as="li" key={index}>{diagnosis}</ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>NONE</p>
                            )}
                        </div>
                        <p>Prescriptions: {patientDetails.prescription}</p>
                    </div>
                )}
            </div>

            <div style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '20px', borderRadius: '8px' }}>
            <Button
                variant="outline-dark"
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
            >
                History Appointments
            </Button>
            <Collapse in={open}>
             <div id="example-collapse-text">
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
                                <td>{appointment.writen_diagnosis || "None"}</td>
                                <td>{appointment.writen_prescription || "None"}</td>
                                <td>{doctorDetailsMap[appointment.doctor_id]?.doctorName || "Unknown"}</td>
                                <td>{doctorDetailsMap[appointment.doctor_id]?.doctorSpecialty || "Unknown"}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
                </Collapse>
                {!showForm && (
                    <div style={{ padding: '20px', borderRadius: '8px' }}>
                        <Button style={{ width: 'fit-content' }} variant="outline-dark" onClick={handleStartAppointment} disabled={appointmentEnded || !isTodayAppointment}>Start Appointment</Button>
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
                                <Button className="sendButton" variant="outline-dark" type="button" onClick={handleEndAppointment}>End Appointment</Button>
                            </div>
                            <Alert variant="danger" show={showAlert} onClose={() => setShowAlert(false)} dismissible>
                                Please fill the summary to end the appointment.
                            </Alert>
                          
                        </form>
                    </div>
                )}

                <Alert variant="danger" show={colusion} onClose={() => setColusion(false)} dismissible>
                    The appointment is within the next 15 minutes from other appointment.
                </Alert>
            </div>
        </>
    );
}

export default PatientAppointment;

