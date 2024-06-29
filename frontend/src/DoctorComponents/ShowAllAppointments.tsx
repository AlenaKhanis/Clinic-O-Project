import { useEffect, useState } from "react";
import "../css/displayAppontments.css";
import { DoctorProps, Appointment } from '../Types';
import { Link } from "react-router-dom";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";
import { useBackendUrl } from "../BackendUrlContext"; 
import { Alert, Modal, Button } from "react-bootstrap";

function DisplayAppointments({ doctorId, onAppointmentAdded }: DoctorProps) {
    const { fetchDoctorAppointments } = useDoctorAppointments();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const backendUrl = useBackendUrl();
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [showModal, setShowModal] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<number | null>(null);

    useEffect(() => {
        if (doctorId) {
            fetchDoctorAppointments(doctorId)
                .then((data: Appointment[]) => {
                    setAppointments(data);
                })
                .catch(error => console.error('Error fetching doctor appointments:', error));
        }
    }, [doctorId, onAppointmentAdded]);

    const filteredAppointments = appointments
        .filter(appointment => {
            const appointmentDateTime = new Date(appointment.date_time);
            const currentDateTime = new Date();

            // Check if the constructed date object is valid
            if (!isNaN(appointmentDateTime.getTime())) {
                const isFuture = appointmentDateTime > currentDateTime;
                const isNotCompleted = appointment.status !== 'completed';
                return isFuture && isNotCompleted;
            } else {
                console.error('Invalid date:', appointment.date_time);
                return false; // or handle this case differently
            }
        })
        .sort((a, b) => {
            const dateA = new Date(a.date_time).getTime();
            const dateB = new Date(b.date_time).getTime();

            return dateA - dateB;
        });

    const handleDeleteAppointment = (appointmentId: number) => {
        fetch(`${backendUrl}/delete_appointment/${appointmentId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
                    setAlertMessage('Appointment deleted successfully');
                    setShowAlert(true);
                    setAlertVariant('success');
                    hideAlertAfterDelay();
                } else {
                    console.error('Failed to delete appointment');
                    setAlertMessage('Failed to delete appointment');
                    setAlertVariant('danger');
                    setShowAlert(true);
                    hideAlertAfterDelay();
                }
            })
            .catch(error => console.error('Error deleting appointment:', error));
    }

    const handleShowModal = (appointmentId: number) => {
        setAppointmentToDelete(appointmentId);
        setShowModal(true);
    }

    const handleConfirmDelete = () => {
        if (appointmentToDelete !== null) {
            handleDeleteAppointment(appointmentToDelete);
        }
        setShowModal(false);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setAppointmentToDelete(null);
    }

    const hideAlertAfterDelay = () => {
        setTimeout(() => {
            setShowAlert(false);
        }, 2000); 
    };


    return (
        <>
             <div className={`appointment-container ${filteredAppointments.length > 0 ? "with-scrollbar" : ""}`}>
                <h2 className="appointment-title">Appointments</h2>
                {filteredAppointments.length > 0 ? (
                    <table className="appointments-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((appointment: Appointment, index: number) => (
                                <tr key={index}>
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time} PM</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        {appointment.status === 'schedule' && (
                                            <Link to={`start_appointment/${appointment.patient_id}/${appointment.id}`} style={{ width: 'fit-content' }} className="btn btn-outline-dark">
                                                Start Appointment
                                            </Link>
                                        )}
                                        {appointment.status === 'open' && (
                                            <button onClick={() => handleShowModal(appointment.id)} className="btn btn-outline-danger">
                                                Delete Appointment
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No appointments</p>
                )}
            </div>
            {showAlert && (
                <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                </Alert>
            )}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this appointment?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DisplayAppointments;
