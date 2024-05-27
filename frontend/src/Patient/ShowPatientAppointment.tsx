import { useEffect, useState } from "react";
import { Appointment, PatientProps } from "../Types";
import { Button, Table, Modal } from "react-bootstrap"; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { usePatientDetails } from "../useFunctions/usePatientDetails";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";

function ShowPatientAppointments({ patientId, refreshAppointments }: PatientProps) {
    const { getPatientAppointments , cancelAppointment } = usePatientDetails();
    const [confirmCancel, setConfirmCancel] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const {getDoctorById , selectedDoctorDetails , setSelectedDoctorDetails} = useDoctorAppointments();

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
    .filter((appointment) => {
        const match = appointment.date_time.match(/(\d+) (\w+) (\d+) (\d+:\d+:\d+)/);
        if (match) {
            const [, day, month, year, time] = match;
            const [hours, minutes, seconds] = time.split(':');

            // Convert month to numeric value
            const numericMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(month);

            // Construct a new Date object
            const appointmentDateTime = new Date(parseInt(year), numericMonth, parseInt(day), parseInt(hours), parseInt(minutes), parseInt(seconds));

            // Check if the constructed date object is valid
            if (!isNaN(appointmentDateTime.getTime())) {
                const currentDateTime = new Date();
                const isFuture = appointmentDateTime > currentDateTime;
                const isNotCompleted = appointment.status !== 'completed';
                return isFuture && isNotCompleted;
            } else {
                console.error('Invalid date:', appointment.date_time);
                return false; // or handle this case differently
            }
        } else {
            console.error('Invalid date format:', appointment.date_time);
            return false; // or handle this case differently
        }
    })
    .sort((a, b) => {
        const dateA = new Date(a.date_time).getTime();
        const dateB = new Date(b.date_time).getTime();
        
        return dateA - dateB;
    });


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
                                        onClick={() => { getDoctorById(appointment.doctor_id) }}
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
