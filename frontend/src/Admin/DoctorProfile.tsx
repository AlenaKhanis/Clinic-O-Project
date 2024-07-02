import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePatientDetails } from '../useFunctions/usePatientDetails';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import { useGlobalFunctions } from '../useFunctions/useGlobalFunctions';
import { useAppointmentActions } from '../useFunctions/useAppointmentActions';

import { Doctor,Appointment, Patient } from '../Types';

import DoctorPatients from './DoctorPatients';
import EditProfile from '../useFunctions/EditProfileProps';

import { Button, Modal, ListGroup } from 'react-bootstrap';
import '../css/doctorProfile.css';

/** 
 * DoctorProfile Component:
 * 
 * This component displays and manages doctor details, appointments, and patients. It fetches initial
 * doctor data and appointments from the backend and provides a modal form for editing doctor details.
 * It also provides a modal for deleting the doctor.
 * 
 */


export default function DoctorProfile({isOwner} : {isOwner: boolean}) {
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [, setShowAlert] = useState<boolean>(false);
  const [ massage , setAlertMessage] = useState<string | null>(null);
  const [ variant , setAlertVariant] = useState<'success' | 'danger'>('success');

  const { getDoctorById, fetchDoctorAppointments } = useDoctorAppointments(); 
  const {handleDeleteUser} = useGlobalFunctions();
  const {filterAppointments} = useAppointmentActions();
  const { getPatientById } = usePatientDetails();



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

  // Function to filter appointments based on date
  const filterAppt = (filterType: string) => {
    setFilteredAppointments(filterAppointments(appointments, filterType));
}
  
  
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

  const onDeleteClick = () => {
    if (doctor) {
      handleDeleteUser(doctor.doctor_id, setAlertMessage, setAlertVariant, setShowAlert);
    } else {
      console.error('Doctor is not selected or not available.');
    }
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
                <Button variant='outline-dark' onClick={() => setShowEditModal(true)}>Edit</Button>
                {isOwner && (
                  <Button variant='outline-danger' onClick={() => setShowDeleteModal(true)}>Delete</Button>
                )}
                
              </>
            )}
          </div>
        </div>
      </div>
      <div className='appointments'>
        <div className='appointments-sidebar'>
          <h2>Appointments</h2>
          <div className='filter-buttons'>
            <Button variant={filter === 'today' ? 'primary' : 'outline-primary'} onClick={() => filterAppt('today')}>Today</Button>
            <Button variant={filter === 'thisWeek' ? 'primary' : 'outline-primary'} onClick={() => filterAppt('thisWeek')}>This Week</Button>
            <Button variant={filter === 'thisMonth' ? 'primary' : 'outline-primary'} onClick={() => filterAppt('thisMonth')}>This Month</Button>
            <Button variant={filter === 'all' ? 'primary' : 'outline-primary'} onClick={() => filterAppt('all')}>All</Button>
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
        onCancel={() => setShowEditModal(false)}
        showEditModal={showEditModal}
        isOwner={isOwner}
      />
      
      )}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
      >
  
        {massage && <p className={`alert alert-${variant}`}>{massage}</p>}
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
          <Button variant="danger" onClick={onDeleteClick}>
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
                  <p>Summary: {selectedAppointment.summary}</p>
                  <p>Written diagnosis: {selectedAppointment.written_diagnosis}</p>
                  <p>Written Prescription: {selectedAppointment.written_prescription}</p>
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

