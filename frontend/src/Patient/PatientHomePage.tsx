
import { Tab, Tabs } from "react-bootstrap";
import SearchDoctors from "./ScedualAppointment";
import { useEffect, useState } from "react";
import ShowPatientAppointments from "./ShowPatientAppointment";
import '../css/Tabs.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


function HomePagePatient() {
    const userInfo = localStorage.getItem('userinfo');
    const [patientId, setpatientId] = useState<string | null>(null);
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
        <div className='welcomdiv'>
            <h1>Here User panel</h1>
            <p>Welcome here you can do oparators</p>
        </div>
        <div className="container">
            <div className="row">
            <Tabs id="uncontrolled-tab-example" className="custom-tabs">
                <Tab eventKey="searchDoctor" title="Search Doctor" className='tabs'>
                    <SearchDoctors 
                    BACKEND_URL={BACKEND_URL}
                    patientId={patientId}
                    refreshAppointments={refreshAppointments}
                    
                     />
                </Tab>
                <Tab eventKey="home" title="Show My Appointments" className='tabs'>
                    <ShowPatientAppointments
                    BACKEND_URL={BACKEND_URL}
                    patientId={patientId}
                    refreshAppointments={refreshAppointments}
                    />
                    
                </Tab>
                <Tab eventKey="Histort Appointments" title="Histort Appointments" className='tabs'>
                    See history Appointment +  button view details -  written summery\prescriprions\ diagnosis
                </Tab>
                <Tab eventKey="My profile" title="My profile" className='tabs'>
                    Update profile \ see profile
                </Tab>
                <Tab eventKey="see my doctors" title="My Doctors" className='tabs'>
                    see all the visited doctors
                </Tab>
            </Tabs>
        </div>
        </div>
         </>
    );
}

export default HomePagePatient;
