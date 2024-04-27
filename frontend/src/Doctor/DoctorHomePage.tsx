import { Tabs, Tab } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../css/adminPage.css';
import AddApointment from './AddAppointment';
import DisplayAppointments from './ShowAllAppointments';
import { useEffect, useState } from 'react';
import HistoryAppointments from './HistoryAppointments';


function DoctorHomePage() {
    const userInfo = localStorage.getItem('userinfo');
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const [appointmentsKey, setAppointmentsKey] = useState<string>("appointments"); 

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
        setAppointmentsKey((prevKey) => prevKey === "appointments" ? "appointments-refresh" : "appointments");
    };

    return (
        <div style={{ width: '900px', height: '700px' }}>

            <Tabs id="uncontrolled-tab-example" className="mb-3" style={{backgroundColor: "#f1f1f2"}}>
                <Tab eventKey="home" title="Open Appointments" className='tabs' >
                    <AddApointment doctorId={doctorId} onSuccess={refreshAppointments} />
                </Tab>
                <Tab eventKey="appointments" title="Appointments" className='tabs'>
                    <DisplayAppointments

                        doctorId={doctorId}
                        onAppointmentAdded={refreshAppointments} // Pass the function as a prop
                        
                    />
                </Tab>
                <Tab eventKey="history appointments" title="History appointments" className='tabs'>
                    <HistoryAppointments
                        doctorId={doctorId}
                        onAppointmentAdded={refreshAppointments}
                    />
                </Tab>
            </Tabs>
        </div>
    );
}

export default DoctorHomePage;
