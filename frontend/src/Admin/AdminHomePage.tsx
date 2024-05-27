import { Tab, Tabs } from "react-bootstrap";
import '../css/Tabs.css';
import ClinicDetails from "./ClinicDetails";
import 'bootstrap/dist/css/bootstrap.min.css';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function AdminPagePatient({userId} : {userId: number}) {

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
                        ownerId={userId}
                    />
                </Tab>
                <Tab eventKey="Doctors" title="Doctors" className="tabs">
                    Tab content list of doctor + update doctor botton + delete button 
                </Tab>
                <Tab eventKey="Add Doctor" title="Add Doctor" className="tabs">
                    Tab content for Add new doctor
                </Tab>
                <Tab eventKey="Show Appointment by doctor" title="Show Appointment" className="tabs">
                    Tab content for show appointment - filter by open \ cancel \ shedual \ all \ date
                </Tab>
                <Tab eventKey="Show all patient " title="Show all patient" className="tabs">
                    Tab content show all patient + update button + delete button 
                </Tab>
            </Tabs>
        </div>
        </>
    );
}

export default AdminPagePatient;

