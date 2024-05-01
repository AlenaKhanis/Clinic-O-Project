import { Tabs, Tab } from 'react-bootstrap';
// import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../css/Tabs.css';
import AddApointment from './AddAppointment';
import DisplayAppointments from './ShowAllAppointments';
import { useEffect, useState } from 'react';
import HistoryAppointments from './AddSummeryAppointment';


//TODO: sent data summery appointment
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function DoctorHomePage() {
    const userInfo = localStorage.getItem('userinfo');
    const [doctorId, setDoctorId] = useState<string | null>(null);
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
        <div style={{ width: '900px', height: '700px' }}>

            <Tabs id="uncontrolled-tab-example" className="mb-3" style={{backgroundColor: "#f1f1f2"}}>
                <Tab eventKey="home" title="Open Appointments" className='tabs' >
                    <AddApointment doctorId={doctorId} onSuccess={refreshAppointments} />
                </Tab>
                <Tab eventKey="appointments" title="Appointments" className='tabs'>
                    <DisplayAppointments
                        BACKEND_URL={BACKEND_URL}
                        doctorId={doctorId}
                        onAppointmentAdded={refreshAppointments} 
                        
                    />
                </Tab>
                <Tab eventKey="Addsummery" title="Add Summery Appointment" className='tabs'>
                    <HistoryAppointments
                        doctorId={doctorId}
                        onAppointmentAdded={refreshAppointments}
                        BACKEND_URL={BACKEND_URL}
                    />
                </Tab>
                <Tab eventKey="history appointments" title="History appointments" className='tabs'>
                    
                </Tab>
                <Tab eventKey="MyPatients" title="My Patients" className='tabs'>

                </Tab>
            </Tabs>
        </div>
    );
}

export default DoctorHomePage;
