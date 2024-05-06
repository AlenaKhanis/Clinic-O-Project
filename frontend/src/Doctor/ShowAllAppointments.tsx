import{ useEffect } from "react";
import "../css/displayAppontments.css";
import { useAppointments } from "./doctorAppointmentFunction";
import {DisplayAppointmentsProps} from '../Types';
import { Button } from "react-bootstrap";
import { usePatient } from "../Patient/patientFunction";
import { useNavigate } from "react-router-dom";


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;



function DisplayAppointments({ doctorId, onAppointmentAdded }: DisplayAppointmentsProps) {
    const { appointments,
            fetchAppointments,
            handleViewDetails,
            selectedPatientDetails,
            filteredAppointments,
            startAppointment,
        } = useAppointments();

    const {getPatientAppointments , historyPatientAppointment} =  usePatient();
    const navigate = useNavigate();



    useEffect(() => {
        if (doctorId) {
            const url = `${BACKEND_URL}/get_appointments?doctor_id=${doctorId}`;
            fetchAppointments(url);
        }
    }, [doctorId, onAppointmentAdded]);


    const viewPatientHistoryAppointments = (patientID: number) => {
        historyPatientAppointment(BACKEND_URL, patientID, (parsedAppointments) => {
            navigate('/patient-appointment', { state: { parsedAppointments } });
        });
    };

    return (
        <>
            <div className={`tab-content ${appointments.length > 0 ? "with-scrollbar" : ""}`}>
                <h2>Appointments</h2>
                {appointments.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredAppointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{appointment.date}</td> 
                                <td>{appointment.time}</td>
                                <td>{appointment.status}</td>
                                <td>
                                    <Button style={{width: 'fit-content'}} variant="outline-dark" onClick={() => handleViewDetails(appointment.patient_id)}>
                                        View Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No appointments</p>
                )}
            </div>
            <div>
                {selectedPatientDetails && (
                        <div className="table-container">
                            <h3>Appointment Details</h3>
                            <p>Patient Name: {selectedPatientDetails.full_name}</p>
                            <p>Patient Pacage: {selectedPatientDetails.package}</p>
                            <p>Age: {selectedPatientDetails.age}</p>
                            {selectedPatientDetails.diagnosis ? (
                                <p>Diagnoses: {selectedPatientDetails.diagnosis}</p>
                            ) : (<p>Diagnoses: No Diagnosis Available</p>)}
                            {selectedPatientDetails.prescription ? (
                                <p>Prescription: {selectedPatientDetails.prescription}</p>
                            ) : (<p>Prescription: No Prescription Available</p>)}
                            <div>
                            <Button style={{width: 'fit-content'}} variant="outline-dark" onClick={() => startAppointment()}>
                                Start Appointment
                            </Button>
                            </div>
                            <br></br>
                            <Button 
                                style={{width: 'fit-content'}} 
                                variant="outline-dark" 
                                onClick={() => {viewPatientHistoryAppointments(selectedPatientDetails.patient_id)}}
                            >
                                View Previous Appointments
                            </Button>

                        </div>
                )}

            </div>
        </>
    );
}    

export default DisplayAppointments;
