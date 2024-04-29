
import { Tab, Tabs } from "react-bootstrap";
import SearchDoctors from "./SerchDoctor";
import { useEffect, useState } from "react";
import ShowPatientAppointments from "./ShowPatientAppointment";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;


function HomePagePatient() {
    const userInfo = localStorage.getItem('userinfo');
    const [patientId, setpatientId] = useState<string | null>(null);

    useEffect(() => {
        if (userInfo) {
            const userInfoObject = JSON.parse(userInfo);
            if (userInfoObject.hasOwnProperty('patient_id')) {
                setpatientId(userInfoObject.patient_id);
            }
        }
    }, [userInfo]);

    return (
        <div style={{ width: '900px', height: '700px' }}>
            <Tabs id="uncontrolled-tab-example" className="mb-3" style={{ backgroundColor: "#f1f1f2" }}>
                <Tab eventKey="searchDoctor" title="Search Doctor" className='tabs'>
                    <SearchDoctors 
                    BACKEND_URL={BACKEND_URL}
                    patientId={patientId}
                     />
                </Tab>
                <Tab eventKey="home" title="Show My Appointments" className='tabs'>
                    <ShowPatientAppointments
                    BACKEND_URL={BACKEND_URL}
                    patientId={patientId}
                    />
                </Tab>
                <Tab eventKey="appointments" title="Appointments" className='tabs'>
                    See Appointment
                </Tab>
                <Tab eventKey="history appointments" title="History appointments" className='tabs'>
                    History Appointment
                </Tab>
            </Tabs>
        </div>
    );
}

export default HomePagePatient;
