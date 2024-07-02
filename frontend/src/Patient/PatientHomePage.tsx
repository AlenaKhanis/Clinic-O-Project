
import { Tab, Tabs } from "react-bootstrap";

import { useEffect, useState } from "react";

import ShowPatientAppointments from "./ShowPatientAppointment";
import SearchDoctors from "./ScedualAppointment";
import PatientHistoryAppointments from "./PatientHistoryAppointments";
import MyDoctors from "./MyDoctors";
import PatientProfile from "./PatientProfile";

import '../css/Tabs.css';

/**
 * HomePagePatient component
 * organize and display different sections of functionality available to a patient.
 * It dynamically renders tabs for searching doctors, viewing appointments, patient history
 * profile management, and managing assigned doctors.
 */


function HomePagePatient() {
    const userInfo = localStorage.getItem('userinfo');
    const [patientId, setpatientId] = useState<number | null>(null);
    const [, setAppointmentsKey] = useState<string>("app"); 


    useEffect(() => {
        if (userInfo) {
            const userInfoObject = JSON.parse(userInfo);
            if (userInfoObject.hasOwnProperty('patient_id')) {
                setpatientId(userInfoObject.patient_id);
            }
        }
    }, [userInfo]);
  

    const refreshAppointments = () => {
        setAppointmentsKey((prevKey) => prevKey === "app" ? "app-refresh" : "app");
    };


    return (
        <>
        <div className="container" style={{marginTop: '300px'}}>
            <div className="row">
            <Tabs id="uncontrolled-tab-example" className="custom-tabs">
                <Tab eventKey="searchDoctor" title="Search Doctor" className='tabs'>
                    <SearchDoctors 
                    patientId={patientId}
                    refreshAppointments={refreshAppointments}
                    
                     />
                </Tab>
                <Tab eventKey="home" title="Show My Appointments" className='tabs'>
                    <ShowPatientAppointments
                    patientId={patientId}
                    refreshAppointments={refreshAppointments}
                    />
                    
                </Tab>
                <Tab eventKey="Histort Appointments" title="Histort Appointments" className='tabs'>
                    <PatientHistoryAppointments
                        patientId={patientId}
                        refreshAppointments={refreshAppointments}
                    />
                </Tab>
                <Tab eventKey="My profile" title="Profile" className='tabs'>
                   <PatientProfile
                    patientId={patientId}
                    
                   />
                </Tab>
                <Tab eventKey="see my doctors" title="My Doctors" className='tabs'>
                    <MyDoctors
                        patientId={patientId}
                        isOwner={false}
                       
                    />
                </Tab>
            </Tabs>
           
        </div>
        </div>

         </>
    );
}

export default HomePagePatient;
