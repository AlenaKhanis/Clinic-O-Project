import { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap"; 

import { Appointment } from "../Types";
import { usePatientDetails } from "../useFunctions/usePatientDetails";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/ShowPatientAppointments.css';

/**
 * ShowPatientAppointments component
 * manages the display and cancellation of future appointments for a patient.
 */

function ShowPatientAppointments({ patientId, refreshAppointments }: {patientId: number | null , refreshAppointments: () => void }) {
    const [confirmCancel, setConfirmCancel] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [showDoctorModal, setShowDoctorModal] = useState(false);

    const {getDoctorById , selectedDoctorDetails} = useDoctorAppointments();
    const { getPatientAppointments , cancelAppointment } = usePatientDetails();



    useEffect(() => {
        if (patientId) {
            getPatientAppointments(patientId)
                .then((data: Appointment[]) => setAppointments(data))
                .catch(error => console.error('Error fetching patient appointments:', error));
        }
    }, [patientId, refreshAppointments]);
    

    const handleCancelAppointment = (appointmentId: number) => {
        cancelAppointment(appointmentId)
            .then(() => {
                setAppointments(prevAppointments => prevAppointments.filter(appointment => appointment.id !== appointmentId));
                setConfirmCancel(false);
                refreshAppointments();
            })
            .catch((error) => console.error('Error cancelling appointment:', error));
    };


    const confirmCancelAppointment = () => {
        if (selectedAppointmentId) {
            handleCancelAppointment(selectedAppointmentId);
        }
    }

    const handleAppointmentCancellation = (appointmentId: number) => {
        setConfirmCancel(true);
        setSelectedAppointmentId(appointmentId);
    }

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
      return false; 
    }
  })
  .sort((a, b) => {
    const dateA = new Date(a.date_time).getTime();
    const dateB = new Date(b.date_time).getTime();
    
    return dateA - dateB;
  });

  const openDoctorDetailsModal = (doctorId: number) => {
    getDoctorById(doctorId); // Assuming this fetches the details and updates `selectedDoctorDetails`
    setShowDoctorModal(true);
    };

    return (
        <div className="content-container">
         <h1>My Appointments</h1>
            {filteredAppointments.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Date</th>
                            <th>Time</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody style={{ backgroundColor: 'white' }} >
                        {filteredAppointments.map((appointment, index) => (
                            <tr key={index}  >
                                <td>{index + 1}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>
                                    <Button
                                        style={{ width: 'fit-content' }}
                                        variant="outline-dark"
                                        onClick={() => openDoctorDetailsModal(appointment.doctor_id)}
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
                <Modal show={showDoctorModal} onHide={() => setShowDoctorModal(false)} className="doctor-details-modal">
                    <Modal.Header closeButton>
                        <Modal.Title className="modal-title">Doctor Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <p><span>Doctor Name:</span> {selectedDoctorDetails.full_name}</p>
                            <p><span>Specialty:</span> {selectedDoctorDetails.specialty}</p>
                            <p><span>Email:</span> {selectedDoctorDetails.email}</p>
                            <p><span>Phone:</span> {selectedDoctorDetails.phone}</p>
                    </Modal.Body>
                </Modal>
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
        </div>
    );
}

export default ShowPatientAppointments;
