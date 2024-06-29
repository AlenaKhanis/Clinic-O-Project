import { Tab, Tabs } from 'react-bootstrap';
import '../css/Tabs.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClinicDetails from './ClinicDetails';
import DoctorsList from './DocotorList';
import ShowAllAppt from './ShowAllAppt';
import ShowAllPatients from './ShowAllPatinets';
import { useState } from 'react';
import AdminAddUser from './AddUserPatienOrDoctor';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function AdminPagePatient() {

    const [refreshPatientsList, setRefreshPatientsList] = useState(false);
    const [refreshDoctorsList, setRefreshDoctorsList] = useState(false);
  
    const handlePatientAdded = () => {
     
      setRefreshPatientsList(prev => !prev);
    };
  
    const handleDoctorAdded = () => {
     
      setRefreshDoctorsList(prev => !prev);
    };
  

  return (
    <>

      <div className='container'>
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
            <ShowAllPatients onPatientAdded={refreshPatientsList}  />
          </Tab>
        </Tabs>
      </div>
    </>
  );
}

export default AdminPagePatient;
