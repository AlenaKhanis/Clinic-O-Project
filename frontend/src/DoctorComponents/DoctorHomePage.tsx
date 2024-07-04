
import { useEffect, useState } from 'react';

import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Tabs.css';

import AddApointment from './AddAppointment';
import DisplayAppointments from './ShowAllAppointments';
import SummeryAppointments from './HistoryAppointments';
import DoctorProfile from './DocotrProfile';
import AllPatientView from './AllPAtientView';


/**
 * DoctorHomePage component
 * Displays a tabbed interface for a doctor's home page with various functionalities.
 */

function DoctorHomePage() {
    const userInfo = localStorage.getItem('userinfo');
    const [doctorId, setDoctorId] = useState<number | null>(null);

    // Refresh key to force component updates
    const [, setAppointmentsKey] = useState<string>("app"); 
 
    useEffect(() => {
        if (userInfo) {
            const userInfoObject = JSON.parse(userInfo);
            if (userInfoObject.hasOwnProperty('doctor_id')) {
                setDoctorId(userInfoObject.doctor_id);
            }
        }
    }, [userInfo]);

   // Function to refresh appointments by updating the key
    const refreshAppointments = () => {
        setAppointmentsKey((prevKey) => prevKey === "app" ? "app-refresh" : "app");
    };
   
    
    return (
        <>
        <div className="tab-main-container">
            <div className='tab-container'>
                    <Tabs id="uncontrolled-tab-example" className="custom-tabs">
                        <Tab eventKey="home" title="Open Appointments" className='tabs'>
                            <AddApointment doctorId={doctorId} onSuccess={refreshAppointments} />
                        </Tab>
                        <Tab eventKey="appointments" title="Appointments" className='tabs'>
                            <DisplayAppointments
                                doctorId={doctorId}
                                onAppointmentAdded={refreshAppointments}
                            />
                        </Tab>
                        <Tab eventKey="History Appointments" title="History Appointments" className='tabs'>
                            <SummeryAppointments
                                doctorId={doctorId}
                                onAppointmentAdded={refreshAppointments}
                            />
                        </Tab>
                        <Tab eventKey="MyPatients" title="My Patients" className='tabs'>
                            <AllPatientView
                                doctorId={doctorId}
                                onAppointmentAdded={refreshAppointments}
                            />
                        </Tab>
                        <Tab eventKey="My profile" title="My profile" className='tabs'>
                            <DoctorProfile
                                doctorId={doctorId}
                                onAppointmentAdded={refreshAppointments}
                            />
                        </Tab>
                    </Tabs>
                </div>
                </div>
                
                </>
    );
}    
export default DoctorHomePage;
