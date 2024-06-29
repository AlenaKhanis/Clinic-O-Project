import { useEffect, useState, useMemo } from "react";
import { Appointment, Doctor, Patient } from "../Types";
import { Button, Dropdown, ListGroup, Modal } from "react-bootstrap";
import { useGlobalFunctions } from "../useFunctions/useGlobalFunctions";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";
import '../css/Tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { usePatientDetails } from "../useFunctions/usePatientDetails";

export default function ShowAllAppt({ BACKEND_URL }: { BACKEND_URL: string }) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
    const [filter, setFilter] = useState<string>('all');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedDoctor, setSelectedDoctor] = useState<string>('all');

    const { parseDateTime } = useGlobalFunctions();
    const { getDoctorById, fetchDoctorAppointments } = useDoctorAppointments();
    const { getPatientById } = usePatientDetails();

    useEffect(() => {
        fetch(`${BACKEND_URL}/get_all_appt`)
            .then(response => response.json())
            .then(data => {
                const parsedAppointments = parseDateTime(data);
                setAppointments(parsedAppointments);
            })
            .catch(error => console.error('Error fetching appointments:', error));

        fetch(`${BACKEND_URL}/doctors`)
            .then(response => response.json())
            .then(data => setDoctors(data))
            .catch(error => console.error('Error fetching doctors:', error));
    }, []);

    useEffect(() => {
        if (doctor) {
            fetchDoctorAppointments(doctor.doctor_id)
                .then(data => {
                    const parsedAppointments = parseDateTime(data);
                    setFilteredAppointments(parsedAppointments);
                })
                .catch(error => console.error('Error fetching doctor appointments:', error));
        }
    }, []);

    const getStartOfWeek = (date: Date): Date => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay()); // start of the week (Sunday)
        startOfWeek.setHours(0, 0, 0, 0); // Start at midnight
        return startOfWeek;
    };
    
    const getEndOfWeek = (date: Date): Date => {
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() - date.getDay() + 6); // end of the week (Saturday)
        endOfWeek.setHours(23, 59, 59, 999); // End of the day
        return endOfWeek;
    };
    
    const isSameDay = (date1: Date, date2: Date): boolean => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };
    

    const filterAppointments = useMemo(() => {
        const today = new Date();
        return appointments.filter(appt => {
            const apptDate = new Date(appt.date_time);
            
            // Filter by 'today'
            if (filter === 'today' && !isSameDay(apptDate, today)) return false;
    
            // Filter by 'thisWeek'
            if (filter === 'thisWeek') {
                const startOfWeek = getStartOfWeek(today);
                const endOfWeek = getEndOfWeek(today);
                if (apptDate < startOfWeek || apptDate > endOfWeek) return false;
            }
    
            // Filter by 'thisMonth'
            if (filter === 'thisMonth' && apptDate.getMonth() !== today.getMonth()) return false;
    
            // Filter by selected status
            if (selectedStatus !== 'all' && appt.status !== selectedStatus) return false;
    
            // Filter by selected doctor
            if (selectedDoctor !== 'all' && appt.doctor_id !== Number(selectedDoctor)) return false;
    
            return true;
        });
    }, [appointments, filter, selectedStatus, selectedDoctor]);
    
    useEffect(() => {
        setFilteredAppointments(filterAppointments);
    }, [filterAppointments]);

    const handleStatusFilter = (status: string | null) => {
        if (status !== null) setSelectedStatus(status);
    };

    const handleDoctorFilter = (eventKey: string | null) => {
        if (eventKey !== null) setSelectedDoctor(eventKey);
    };

    const handleAppointmentClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        if (appointment.doctor_id) {
            getDoctorById(appointment.doctor_id)
                .then(setDoctor)
                .catch(error => console.error('Error fetching doctor:', error));
        }
        if (appointment.patient_id) {
            getPatientById(appointment.patient_id)
                .then((data: Patient) => {
                    setPatient(data);
                })
                .catch(error => console.error('Error fetching patient:', error));
        }
        setShowAppointmentDetails(true);
    };

    const handleCloseAppointmentDetails = () => {
        setShowAppointmentDetails(false);
    };

    const uniqueStatuses = useMemo(() => Array.from(new Set(appointments.map(appt => appt.status))), [appointments]);

    return (
        <div>
            <div className='appointments'>
                <div className='appointments-sidebar' style={{ width: '100%' }}>
                    <h2>Appointments</h2>
                    <div className='filter-buttons'>
                        <Button variant={filter === 'today' ? 'primary' : 'outline-primary'} onClick={() => setFilter('today')}>Today</Button>
                        <Button variant={filter === 'thisWeek' ? 'primary' : 'outline-primary'} onClick={() => setFilter('thisWeek')}>This Week</Button>
                        <Button variant={filter === 'thisMonth' ? 'primary' : 'outline-primary'} onClick={() => setFilter('thisMonth')}>This Month</Button>
                        <Button variant={filter === 'all' ? 'primary' : 'outline-primary'} onClick={() => setFilter('all')}>All</Button>
                    </div>
                    <div className='filter-dropdown'>
                        <Dropdown onSelect={handleStatusFilter}>
                            <Dropdown.Toggle variant="success" id="dropdown-status">
                                {selectedStatus === 'all' ? 'Filter by Status' : selectedStatus}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                                {uniqueStatuses.map(status => (
                                    <Dropdown.Item key={status} eventKey={status}>{status}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown onSelect={handleDoctorFilter}>
                            <Dropdown.Toggle variant="success" id="dropdown-doctor">
                                {selectedDoctor === 'all' ? 'Filter by Doctor' : doctors.find(doc => doc.doctor_id === Number(selectedDoctor))?.full_name}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item eventKey="all">All</Dropdown.Item>
                                {doctors.map(doctor => (
                                    <Dropdown.Item key={doctor.doctor_id} eventKey={String(doctor.doctor_id)}>{doctor.full_name}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <ListGroup>
                        {filteredAppointments.map((appointment, index) => (
                            <ListGroup.Item key={index} onClick={() => handleAppointmentClick(appointment)}>
                                <div>Date: {appointment.date}</div>
                                <div>Time: {appointment.time}</div>
                                <div>Status: {appointment.status}</div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>
            <Modal
                show={showAppointmentDetails}
                onHide={handleCloseAppointmentDetails}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Appointment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAppointment && (
                        <div>
                            {selectedAppointment.status === 'completed' && patient && (
                                <>  
                                    <h4>Doctor: {doctor?.full_name}</h4>
                                    <p>Patient: {patient.full_name}</p>
                                    <p>Summary: {selectedAppointment.summary}</p>
                                    <p>Written diagnosis: {selectedAppointment.written_diagnosis}</p>
                                    <p>Written Prescription: {selectedAppointment.written_prescription}</p>
                                </>
                            )}
                            {selectedAppointment.status === 'schedule' && (
                                <>
                                    <h4>Doctor: {doctor?.full_name}</h4>
                                    <p>Patient: {patient && patient.full_name}</p>
                                    <p>Information not yet provided.</p>
                                </>
                            )}
                            {selectedAppointment.status === 'open' && (
                                <p>No patient assigned to this appointment.</p>
                            )}
                        </div>
                    )}
                    {!selectedAppointment && <p>No appointment selected.</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAppointmentDetails}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
