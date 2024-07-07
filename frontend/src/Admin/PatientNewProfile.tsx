import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, ListGroup, Collapse } from 'react-bootstrap';

import EditProfile from '../useFunctions/EditProfileProps';
import MyDoctors from '../Patient/MyDoctors';

import { Doctor, Appointment, Patient } from '../Types';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import { usePatientDetails } from '../useFunctions/usePatientDetails';
import { useGlobalFunctions } from '../useFunctions/useGlobalFunctions';


import '../css/doctorProfile.css';
import { useAppointmentActions } from '../useFunctions/useAppointmentActions';

/**
 * PatientProfile Component:
 * This component fetches and displays a patient's details and appointments.
 * It also renders a list of appointments with date, time, and status.
 * The appointments can be filtered by today, this week, this month, or all.
 * The component also renders a list of doctors assigned to the patient.
 * The patient's diagnosis and prescriptions can be viewed by clicking on the respective buttons.
 * The patient's details can be edited or deleted by the admin.
 * The patient's details can be edited by the admin of the patient.
 * The appointment details can be viewed by clicking on the appointment.
 */


export default function PatientProfile({ isOwner , userRole}: { isOwner: boolean , userRole: string}) {
    const { patient_id } = useParams<{ patient_id: string }>();
    const patientId = Number(patient_id);
    const {filterAppointments} = useAppointmentActions();
    
     // State variables
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [filter] = useState<string>('all');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
    const [openPrescriptions, setOpenPrescriptions] = useState(false);
    const [openDiagnosis, setOpenDiagnosis] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [, setShowAlert] = useState<boolean>(false);
    const [ massage , setAlertMessage] = useState<string | null>(null);
    const [variant, setAlertVariant] = useState<'success' | 'danger'>('success');

    const { getDoctorById } = useDoctorAppointments();
    const { getPatientById, getPatientAppointments } = usePatientDetails(); 
    const {handleDeleteUser} = useGlobalFunctions();

     // Fetch patient details and appointments on component mount or showEditModal change
    useEffect(() => {
        if (patientId) {
        getPatientById(patientId)
            .then((data: Patient) => {
            setPatient(data);
            })
            .catch(error => console.error('Error fetching patient:', error));

        getPatientAppointments(patientId)
            .then((data: Appointment[]) => {
            setAppointments(data);
            setFilteredAppointments(data);
            })
            .catch(error => console.error('Error fetching appointments:', error));
        }
    }, [patientId, showEditModal]);

    // Fetch doctor details when selectedAppointment changes
    useEffect(() => {
        if (selectedAppointment && selectedAppointment.doctor_id) {
        getDoctorById(selectedAppointment.doctor_id)
            .then((data: Doctor) => {
            setDoctor(data);
            })
            .catch(error => console.error('Error fetching doctor:', error));
        }
    }, [selectedAppointment]);

    
    // Filter appointments based on filterType
    const filterAppt = (filterType: string) => {
        setFilteredAppointments(filterAppointments(appointments, filterType));
    }

    // Handle appointment click event
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

    // Close appointment details modal
    const handleCloseAppointmentDetails = () => {
        setSelectedAppointment(null);
        setShowAppointmentDetails(false);
    };

    // Handle delete button click event
    const onDeleteClick = () => {
        if (patient) {
        handleDeleteUser(patient.patient_id , setAlertMessage, setAlertVariant, setShowAlert);
        } else {
        console.error('Patient is not selected or not available.');
        }
    };


  return (
    <div className='doctor-container-profile'>
      <div className='container-profile-for-doctor'>
        <div className='profile-content'>
          <div className='doctor-info'>
            {patient && (
              <>
                <h2>Patient Details</h2>
                <>
                    <ListGroup>
                        <ListGroup.Item>Patient Name: {patient.full_name}</ListGroup.Item>
                        <ListGroup.Item>Age: {patient.age}</ListGroup.Item>
                        <ListGroup.Item>Package: {patient.package}</ListGroup.Item>
                        <ListGroup.Item>Phone: {patient.phone}</ListGroup.Item>
                        <ListGroup.Item>Email: {patient.email}</ListGroup.Item>
                    </ListGroup>
                    <div style={{margin: '10px'}} >
                        <Button
                        style={{ width: 'fit-content', marginBottom: '10px' }}
                        variant="outline-dark"
                        onClick={() => setOpenDiagnosis(!openDiagnosis)}
                        aria-controls="diagnosis-collapse-text"
                        aria-expanded={openDiagnosis}
                        >
                        Diagnosis
                        </Button>
                        <Collapse in={openDiagnosis}>
                        <div id="diagnosis-collapse-text">
                            {Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0 ? (
                            <ListGroup as="ol" numbered>
                                {patient.diagnosis.map((diagnosis: string, index: number) => (
                                <ListGroup.Item as="li" key={index}>{diagnosis}</ListGroup.Item>
                                ))}
                            </ListGroup>
                            ) : (
                            <p>NONE</p>
                            )}
                        </div>
                        </Collapse>
                        </div>
                           <div>
                            <Button
                            style={{ width: 'fit-content', marginBottom: '10px' }}
                            variant="outline-dark"
                            onClick={() => setOpenPrescriptions(!openPrescriptions)}
                            aria-controls="prescriptions-collapse-text"
                            aria-expanded={openPrescriptions}
                            >
                            Prescriptions
                            </Button>
                            <Collapse in={openPrescriptions}>
                            <div id="prescriptions-collapse-text">
                                {Array.isArray(patient.prescription) && patient.prescription.length > 0 ? (
                                <ListGroup as="ol" numbered>
                                    {patient.prescription.map((prescription: string, index: number) => (
                                    <ListGroup.Item as="li" key={index}>{prescription}</ListGroup.Item>
                                    ))}
                                </ListGroup>
                                ) : (
                                <p>NONE</p>
                                )}
                            </div>
                            </Collapse>
                        </div>
                         
                        </>
                        {/* Only show edit button if the user is the admin or patient */}
                        {(isOwner || userRole === 'patient' || userRole === 'admin') && (
                          <Button variant='outline-dark' onClick={() => setShowEditModal(true)}>Edit</Button>
                        )}
                        {/* Only show delete button if the user is the admin */}
                        {isOwner && (
                        <>
                        <Button variant='outline-danger' onClick={() => setShowDeleteModal(true)}>Delete</Button>
                        </>
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
              <MyDoctors 
                patientId={patientId}
                isOwner={isOwner}
              />
            </div>
          </div>
          {patient && (
            <EditProfile
              profile={patient}
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
              Are you sure you want to delete  {patient?.full_name}?
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
                      <h4>Doctor: {doctor && doctor.full_name}</h4>
                      <p>Patient: {patient.full_name}</p>
                      <p>Summary: {selectedAppointment.summary}</p>
                      <p>Written diagnosis: {selectedAppointment.written_diagnosis}</p>
                      <p>Written Prescription: {selectedAppointment.written_prescription}</p>
                    </>
                  )}
                  {selectedAppointment.status === 'schedule' && (
                    <>
                      <h4>Doctor: {doctor && doctor.full_name}</h4>  
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
