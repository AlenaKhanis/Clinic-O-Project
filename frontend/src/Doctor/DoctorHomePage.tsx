import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Tabs.css';
import AddApointment from './AddAppointment';
import DisplayAppointments from './ShowAllAppointments';
import { useEffect, useState } from 'react';
import SummeryAppointments from './HistoryAppointments';
import DoctorProfile from './DocotrProfile';


//TODO: sent data summery appointment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function DoctorHomePage() {
    const userInfo = localStorage.getItem('userinfo');
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [, setAppointmentsKey] = useState<string>("app"); 
 
    useEffect(() => {
        if (userInfo) {
            const userInfoObject = JSON.parse(userInfo);
            if (userInfoObject.hasOwnProperty('doctor_id')) {
                setDoctorId(userInfoObject.doctor_id);
            }
        }
    }, [userInfo]);

    // Function to force re-render DisplayAppointments component
    const refreshAppointments = () => {
        setAppointmentsKey((prevKey) => prevKey === "app" ? "app-refresh" : "app");
    };
   
    
    return (
        <>
        <div className='welcomdiv'>
            <h1>Here doctor panel</h1>
            <p>Welcome here you can do oparators</p>
        </div>
        <div className="container">
            <div className="row">
                    <Tabs id="uncontrolled-tab-example" className="custom-tabs">
                        <Tab eventKey="home" title="Open Appointments" className='tabs'>
                            <AddApointment doctorId={doctorId} onSuccess={refreshAppointments} />
                        </Tab>
                        <Tab eventKey="appointments" title="Appointments" className='tabs'>
                            <DisplayAppointments
                                BACKEND_URL={BACKEND_URL}
                                doctorId={doctorId}
                                onAppointmentAdded={refreshAppointments}
                            />
                        </Tab>
                        <Tab eventKey="History Appointments" title="History Appointments" className='tabs'>
                            <SummeryAppointments
                                doctorId={doctorId}
                                onAppointmentAdded={refreshAppointments}
                                BACKEND_URL={BACKEND_URL}
                            />
                        </Tab>
                        <Tab eventKey="MyPatients" title="My Patients" className='tabs'>
                            see my patient list
                        </Tab>
                        <Tab eventKey="My profile" title="My profile" className='tabs'>
                            <DoctorProfile
                                doctorId={doctorId}
                                onAppointmentAdded={refreshAppointments}
                                BACKEND_URL={BACKEND_URL}
                            />
                        </Tab>
                    </Tabs>
                </div>
                </div>
                </>
    );
}    
export default DoctorHomePage;
