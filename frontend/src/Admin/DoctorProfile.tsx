import { useState, useEffect } from 'react';
import { Button, Modal, ListGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import '../css/doctorProfile.css';
import { usePatientDetails } from '../useFunctions/usePatientDetails';
import DoctorPatients from './DoctorPatients';
import EditDoctorProfile from '../useFunctions/EditDoctorProfile';
import { Doctor, OwnerProps, Appointment, Patient } from '../Types';
import EditProfile from '../useFunctions/EditProfileProps';

export default function DoctorProfile({ BACKEND_URL }: OwnerProps) {
  const { doctorId } = useParams<{ doctorId: string }>();
  const doctorID = Number(doctorId);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filter, ] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const { getPatientById } = usePatientDetails();
  const [showEditModal, setShowEditModal] = useState(false);
  const [, setShowAlert] = useState<boolean>(false);
  const [, setAlertMessage] = useState<string | null>(null);
  const [, setAlertVariant] = useState<'success' | 'danger'>('success');
  const { getDoctorById, fetchDoctorAppointments, handleSaveChanges } = useDoctorAppointments(); 

  useEffect(() => {
    if (doctorID) {
      getDoctorById(doctorID)
        .then((data: Doctor) => {
          setDoctor(data);
        })
        .catch(error => console.error('Error fetching doctor:', error));

      fetchDoctorAppointments(doctorID)
        .then((data: Appointment[]) => {
          setAppointments(data);
          setFilteredAppointments(data);
        })
        .catch(error => console.error('Error fetching appointments:', error));
    }
  }, [doctorID , showEditModal]);

  useEffect(() => {
    if (selectedAppointment && selectedAppointment.patient_id) {
      getPatientById(selectedAppointment.patient_id)
        .then((data: Patient) => {
          setPatient(data);
        })
        .catch(error => console.error('Error fetching patient:', error));
    }
  }, [selectedAppointment]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

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
    setShowAppointmentDetails(true);
    if (appointment.patient_id) {
      getPatientById(appointment.patient_id)
        .then((data: Patient) => {
          setPatient(data);
        })
        .catch(error => console.error('Error fetching patient:', error));
    }
  };

  const handleCloseAppointmentDetails = () => {
    setSelectedAppointment(null);
    setShowAppointmentDetails(false);
  };

  const handleDelete = () => {
    if (doctor) {
      fetch(`${BACKEND_URL}/delete_doctor/${doctor.doctor_id}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setAlertMessage('Doctor deleted successfully');
        setAlertVariant('success');
        setShowAlert(true);
      })
      .catch((error) => {
        console.error('Error deleting doctor:', error);
        setAlertMessage('Error deleting doctor');
        setAlertVariant('danger');
        setShowAlert(true);
      });
    }
    setShowDeleteModal(false);
  };

  return (
    <div className='doctor-container-profile'>
      <div className='container-profile-for-doctor'>
        <div className='profile-content'>
          <div className='doctor-info'>
            {doctor && (
              <>
                <h1>Dr. {doctor.full_name}</h1>
                <p>Specialty: {doctor.specialty}</p>
                <p>Email: {doctor.email}</p>
                <p>Phone: {doctor.phone}</p>
                <Button variant='outline-dark' onClick={handleEdit}>Edit</Button>
                <Button variant='outline-danger' onClick={() => setShowDeleteModal(true)}>Delete</Button>
              </>
            )}
          </div>
        </div>
      </div>
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
            {filteredAppointments.length === 0 ? (
              <ListGroup.Item>No appointments available</ListGroup.Item>
            ) : (
              filteredAppointments.map((appointment, index) => (
                <ListGroup.Item key={index} onClick={() => handleAppointmentClick(appointment)}>
                  <div>Date: {appointment.date}</div>
                  <div>Time: {appointment.time}</div>
                  <div>Status: {appointment.status}</div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </div>
      </div>
      <div className='doctor-patients-container'>
        <div className='patient-sidebar'>
          <DoctorPatients doctorId={doctorID} />
        </div>
      </div>
      {doctor && (
        <EditProfile
        profile={doctor}
        onSaveDoctorChanges={handleSaveChanges}
        onCancel={() => setShowEditModal(false)}
        showEditModal={showEditModal}
      />
      
      )}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete Dr. {doctor?.full_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
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
                  <h4>Patient: {patient.full_name}</h4>
                  <p>Summary: {selectedAppointment.summery}</p>
                  <p>Written diagnosis: {selectedAppointment.writen_diagnosis}</p>
                  <p>Written Prescription: {selectedAppointment.writen_prescription}</p>
                </>
              )}
              {selectedAppointment.status === 'schedule' && (
                <>
                  <h4>Patient: {patient && patient.full_name}</h4>
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

