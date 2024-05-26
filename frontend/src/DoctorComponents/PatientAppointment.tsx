import { useEffect, useRef, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Appointment } from "../Types";
import '../css/AppointmentSummeryForm.css';
import '../css/Tabs.css';
import Collapse from 'react-bootstrap/Collapse';
import { useAppointmentActions } from "../useFunctions/useAppointmentActions";
import HistoryAppointments from "../HistoryPatientAppointments";
import PatientDetails from "../PatientDetails";
import { usePatientDetails } from "../useFunctions/usePatientDetails";

//TODO: add css

const PatientDetail = () => {
    const { patient_id, appointment_id } = useParams<{ patient_id: string, appointment_id: string }>();
    const patientIdNumber = Number(patient_id);
    const appointmentIdNumber = Number(appointment_id);
    const { getAppointmentsbyID, handleSubmit } = useAppointmentActions();
    const [showForm, setShowForm] = useState(false);
    const summaryRef = useRef<HTMLTextAreaElement>(null);
    const diagnosisRef = useRef<HTMLInputElement>(null);
    const prescriptionRef = useRef<HTMLInputElement>(null);
    const [appointmentEnded, setAppointmentEnded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [collision, setCollision] = useState(false);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [patientHistoryAppointments, setPatientHistoryAppointments] = useState<Appointment[]>([]);
    const { getPatientHistoryAppointments } = usePatientDetails();

    
    useEffect(() => {
        if (patient_id) {
            getPatientHistoryAppointments(patientIdNumber)
                .then((data: Appointment[]) => {
                    setPatientHistoryAppointments(data);
                })
                .catch(error => {
                    console.error("Error fetching patient history appointments:", error);
                });
        }
    }, [patient_id]);

    useEffect(() => {
        if (appointment_id) {
            getAppointmentsbyID(appointmentIdNumber)
                .then((data: Appointment) => {
                    setAppointment(data);
                    if (data.status === 'completed') {
                        setAppointmentEnded(true);
                    }
                })
                .catch(error => {
                    console.error("Error fetching appointment details:", error);
                });
        }
    }, [appointment_id]);



    const handleStartAppointment = () => {
        if (!appointment) return;

        const currentDate = new Date();
        const endTime = new Date(currentDate.getTime() + 15 * 60000); // 15 minutes from current time

        const isWithin15Minutes = patientHistoryAppointments.some(appointment =>
            appointment.id !== appointmentIdNumber &&
            (
                (endTime.getTime() >= new Date(appointment.date_time).getTime() &&
                    endTime.getTime() <= new Date(appointment.date_time).getTime() + 15 * 60000) ||
                (currentDate.getTime() >= new Date(appointment.date_time).getTime() &&
                    currentDate.getTime() <= new Date(appointment.date_time).getTime() + 15 * 60000)
            )
        );

        if (isWithin15Minutes) {
            setCollision(true);
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
        handleSubmit(summaryRef, diagnosisRef, prescriptionRef, appointmentIdNumber, patientIdNumber);
        setShowForm(false);
        setAppointmentEnded(true);
        setShowSuccess(true);
    };

    return (
        <>
            <div className="box-main-div">
                {appointmentEnded && <Alert variant="success" show={showSuccess} onClose={() => setShowSuccess(false)} dismissible>Appointment has ended.</Alert>}
                <PatientDetails />
                <HistoryAppointments />
                <div>
                    <div style={{ padding: '20px', borderRadius: '8px' }}>
                        <Button
                            style={{ width: 'fit-content' }}
                            variant="outline-dark"
                            onClick={() => {
                                handleStartAppointment();
                                setShowForm(!showForm);
                            }}
                            disabled={appointmentEnded}
                        >
                            {showForm ? "Close Appointment" : "Start Appointment"}
                        </Button>
                    </div>
                    <Collapse in={showForm}>
                        <div className="containerSummery">
                            <form>
                                <div className="row">
                                    <div className="col-25">
                                        <label className="labelSummery">Diagnosis</label>
                                    </div>
                                    <div className="col-75">
                                        <input type="text" id="summary" name="summary" placeholder="Diagnosis.." ref={diagnosisRef} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-25">
                                        <label className="labelSummery">Prescription</label>
                                    </div>
                                    <div className="col-75">
                                        <input type="text" id="prescription" name="prescription" placeholder="Prescription.." ref={prescriptionRef} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-25">
                                        <label className="labelSummery">Summary</label>
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
                    </Collapse>
                    <Alert variant="danger" show={collision} onClose={() => setCollision(false)} dismissible>
                        The appointment is within the next 15 minutes from another appointment.
                    </Alert>
                </div>
            </div>
        </>
    );
};

export default PatientDetail;
