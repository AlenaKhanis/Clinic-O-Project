import { Tab, Tabs } from "react-bootstrap";
import '../css/Tabs.css';
import ClinicDetails from "./ClinicDetails";
import 'bootstrap/dist/css/bootstrap.min.css';
import DoctorsList from "./DocotorList";
import AddUserPatienOrDoctor from "./AddUserPatienOrDoctor";
import ShowAllAppt from "./ShowAllAppt";
import ShowAllPatients from "./ShowAllPatinets";



const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function AdminPagePatient() {

    return (
        <>
        <div className='welcome-div'>
            <h1>Here doctor panel</h1>
            <p>Welcome here you can do oparators</p>
        </div>
        <div className="container">
            <Tabs  id="uncontrolled-tab-example" className="custom-tabs">
                <Tab eventKey=" Clinic Details" title="Clinic Details" className="tabs">
                    <ClinicDetails 
                        BACKEND_URL={BACKEND_URL}
                       
                    />
                </Tab>
                <Tab eventKey="Doctors" title="Doctors" className="tabs">
                   <DoctorsList
                    BACKEND_URL={BACKEND_URL}
                    
                   />
                </Tab>
                <Tab eventKey="Add Doctor" title="Add Doctor/Patient" className="tabs">
                    <AddUserPatienOrDoctor
                    />
                </Tab>
                <Tab eventKey="Show Appointment" title="Show Appointment" className="tabs">
                    <ShowAllAppt 
                    BACKEND_URL={BACKEND_URL} />
                </Tab>
                <Tab eventKey="Show all patient " title="Show all patient" className="tabs">
                    <ShowAllPatients 
                    BACKEND_URL={BACKEND_URL}
                    />
                </Tab>
            </Tabs>
        </div>
        </>
    );
}

export default AdminPagePatient;

