import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Tabs.css';
import AddApointment from './AddAppointment';
import DisplayAppointments from './ShowAllAppointments';
import { useEffect, useState } from 'react';
import SummeryAppointments from './HistoryAppointments';
import DoctorProfile from './DocotrProfile';
import AllPatientView from './AllPAtientView';


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

   
    const refreshAppointments = () => {
        setAppointmentsKey((prevKey) => prevKey === "app" ? "app-refresh" : "app");
    };
   
    
    return (
        <>
        <div className="container">
            
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
                            <AllPatientView
                                doctorId={doctorId}
                                onAppointmentAdded={refreshAppointments}
                                BACKEND_URL={BACKEND_URL}
                            />
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
                
                </>
    );
}    
export default DoctorHomePage;
