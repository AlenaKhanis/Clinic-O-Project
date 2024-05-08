import { useEffect, useState } from "react";
import { PatientProps } from "../Types";
import { Button, Table, Modal } from "react-bootstrap"; 
import { usePatient } from "./patientFunction";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppointments } from "../Doctor/doctorAppointmentFunction";

function ShowPatientAppointments({ BACKEND_URL, patientId, refreshAppointments }: PatientProps) {
    const { filteredAppointments, getPatientAppointments, cancelAppointment } = usePatient();
    const { getDoctordetails, selectedDoctorDetails, setSelectedDoctorDetails } = useAppointments();
    const [confirmCancel, setConfirmCancel] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

    useEffect(() => {
        if (patientId) {
            const url = `${BACKEND_URL}/get_appointments_by_patient_id/${patientId}`;
            getPatientAppointments(url);
        }
    }, [patientId, refreshAppointments]);
    

    const handleCancelAppointment = (appointmentId: number) => {
        cancelAppointment(BACKEND_URL, appointmentId);
        setConfirmCancel(false);
    }

    const confirmCancelAppointment = () => {
        if (selectedAppointmentId) {
            handleCancelAppointment(selectedAppointmentId);
        }
    }

    const handleAppointmentCancellation = (appointmentId: number) => {
        setConfirmCancel(true);
        setSelectedAppointmentId(appointmentId);
    }

    return (
        <>
            {filteredAppointments.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAppointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>
                                    <Button
                                        style={{ width: 'fit-content' }}
                                        variant="outline-dark"
                                        onClick={() => { getDoctordetails(BACKEND_URL, appointment.doctor_id) }}
                                    >
                                        View Details
                                    </Button>
                                </td>
                                <td>
                                    <Button variant="outline-danger" onClick={() => handleAppointmentCancellation(appointment.id)}>Cancel Appointment</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <div>
                    <h1>No future appointments</h1>
                </div>
            )}

            {selectedDoctorDetails && (
                <div>
                    <div
                        style={{ textAlign: 'right', cursor: 'pointer' }}
                        onClick={() => setSelectedDoctorDetails(null)}
                    >
                        X
                    </div>
                    <p>Doctor Name: {selectedDoctorDetails.full_name}</p>
                </div>
            )}

            <Modal show={confirmCancel} onHide={() => setConfirmCancel(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cancel Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to cancel this appointment?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmCancel(false)}>No</Button>
                    <Button variant="danger" onClick={confirmCancelAppointment}>Yes</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ShowPatientAppointments;
