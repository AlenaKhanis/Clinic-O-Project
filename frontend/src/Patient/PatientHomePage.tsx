
import { Tab, Tabs } from "react-bootstrap";
import SearchDoctors from "./SerchDoctor";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function HomePagePatient() {
    return (
        <div style={{ width: '900px', height: '700px' }}>
            <Tabs id="uncontrolled-tab-example" className="mb-3" style={{ backgroundColor: "#f1f1f2" }}>
                <Tab eventKey="searchDoctor" title="Search Doctor" className='tabs'>
                    <SearchDoctors BACKEND_URL={BACKEND_URL} />
                </Tab>
                <Tab eventKey="home" title="Open Appointments" className='tabs'>
                    Schedule Appointment
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
