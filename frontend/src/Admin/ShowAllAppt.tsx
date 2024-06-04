import { useEffect, useState } from "react"
import { Appointment, Doctor } from "../Types"
import { Button, Dropdown, ListGroup, Modal } from "react-bootstrap";
import { useGlobalFunctions } from "../useFunctions/useGlobalFunctions";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";

export default function ShowAllAppt({BACKEND_URL}:  {BACKEND_URL : string}) {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
    const { parseDateTime } = useGlobalFunctions();
    const [filter, ] = useState<string>('all');
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const {getDoctorById} = useDoctorAppointments();

    useEffect(() => {
        fetch(`${BACKEND_URL}/get_all_appt`)
        .then(response => response.json())
        .then(data => {
            const parsedAppointments = parseDateTime(data);
            setAppointments(parsedAppointments)
        })
    }, [])

    const filterAppointments = (filterType: string) => {
        const today = new Date();
        const filteredAppointments = appointments.filter((appt) => {
          const apptDate = new Date(appt.date_time);
          switch (filterType) {
            case 'today':
              return apptDate.toDateString() === today.toDateString();
            case 'thisWeek':
              const startOfWeek = new Date(today);
              const endOfWeek = new Date(today);
              startOfWeek.setDate(today.getDate() - today.getDay());
              endOfWeek.setDate(today.getDate() - today.getDay() + 6);
              return apptDate >= startOfWeek && apptDate <= endOfWeek;
            case 'thisMonth':
              return apptDate.getMonth() === today.getMonth();
            default:
              return true;
          }
        });
        setFilteredAppointments(filteredAppointments);
      };
    

const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    if(appointment.doctor_id) {
        getDoctorById(appointment.doctor_id)
        .then((data: Doctor) => {
            setDoctor(data);
        })
        .catch(error => console.error('Error fetching doctor:', error));

    }
    setShowAppointmentDetails(true);
}
        
    const handleCloseAppointmentDetails = () => {
        setShowAppointmentDetails(false);
      }

    
    return (
      
    <div>
        <div className='appointments'>
            <div className='appointments-sidebar'>
            <h2>Appointments</h2>
            <div className='filter-buttons'>
            <Button variant={filter === 'today' ? 'primary' : 'outline-primary'} onClick={() => filterAppointments('today')}>Today</Button>
            <Button variant={filter === 'thisWeek' ? 'primary' : 'outline-primary'} onClick={() => filterAppointments('thisWeek')}>This Week</Button>
            <Button variant={filter === 'thisMonth' ? 'primary' : 'outline-primary'} onClick={() => filterAppointments('thisMonth')}>This Month</Button>
            <Button variant={filter === 'all' ? 'primary' : 'outline-primary'} onClick={() => filterAppointments('all')}>All</Button>
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
                    {doctor && (
                        <>
                        <h4>Doctor: {doctor.full_name}</h4>
                        <p>Summary: {selectedAppointment.summery}</p>
                        <p>Written diagnosis: {selectedAppointment.writen_diagnosis}</p>
                        <p>Written Prescription: {selectedAppointment.writen_prescription}</p>
                        </>
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
    )
}