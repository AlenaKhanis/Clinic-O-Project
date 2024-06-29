import { Tab, Tabs } from 'react-bootstrap';
import '../css/Tabs.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import ClinicDetails from './ClinicDetails';
import DoctorsList from './DocotorList'; 
import ShowAllAppt from './ShowAllAppt'; 
import ShowAllPatients from './ShowAllPatinets'; 
import { useState } from 'react';
import AdminAddUser from './AddUserPatienOrDoctor'; 
import { useBackendUrl } from '../BackendUrlContext';
/**
 * AdminPagePatient Component:
 * 
 * This component represents the main administrative page for managing clinic details,
 * doctors, patients, appointments, and adding new users (patients/doctors). It uses
 * React Bootstrap Tabs for navigation between different sections.
 */


function AdminPagePatient() {
  const BACKEND_URL = useBackendUrl();
  const [refreshPatientsList, setRefreshPatientsList] = useState(false); 
  const [refreshDoctorsList, setRefreshDoctorsList] = useState(false); 

  // Function to handle refresh of patients list triggered by AdminAddUser component
  const handlePatientAdded = () => {
    setRefreshPatientsList(prev => !prev); 
  };

  // Function to handle refresh of doctors list triggered by AdminAddUser component
  const handleDoctorAdded = () => {
    setRefreshDoctorsList(prev => !prev); 
  };

  return (
    <>
      <div className='container'>
        {/* Tabs component for navigation */}
        <Tabs id='uncontrolled-tab-example' className='custom-tabs'>
          <Tab eventKey='clinicDetails' title='Clinic Details' className='tabs'>
            <ClinicDetails />
          </Tab>
          <Tab eventKey='doctors' title='Doctors' className='tabs'>
            <DoctorsList onDoctorAdded={refreshDoctorsList} />
          </Tab>
          <Tab eventKey='addDoctor' title='Add Doctor/Patient' className='tabs'>
            <AdminAddUser onPatientAdded={handlePatientAdded} onDoctorAdded={handleDoctorAdded} />
          </Tab>
          <Tab eventKey='showAppointment' title='Show Appointment' className='tabs'>
            <ShowAllAppt BACKEND_URL={BACKEND_URL} />
          </Tab>
          <Tab eventKey='showAllPatients' title='Show all patients' className='tabs'>
            <ShowAllPatients onPatientAdded={refreshPatientsList} />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default AdminPagePatient;
