import { Tab, Tabs } from "react-bootstrap";
import '../css/Tabs.css';


function AdminPagePatient() {

    return (
        <div style={{ width: '900px', height: '700px' }}>
            <Tabs  id="uncontrolled-tab-example" className="mb-3" style={{backgroundColor: "#f1f1f2"}}>
                <Tab eventKey=" Clinic Details" title="Clinic Details" className="tabs">
                    Tab content for Clinic Details and update clinic details
                </Tab>
                <Tab eventKey="Doctors" title="Doctors" className="tabs">
                    Tab content list of doctor + update doctor botton + delete button 
                </Tab>
                <Tab eventKey="Add Doctor" title="Add Doctor" className="tabs">
                    Tab content for Add new doctor
                <Tab eventKey="Show Appointment by doctor" title="Show Appointment" className="tabs">
                </Tab>
                    Tab content for show appointment - filter by open \ cancel \ shedual \ all \ date
                </Tab>
                <Tab eventKey="Show all patient " title="Show all patient" className="tabs">
                    Tab content show all patient + update button + delete button 
                </Tab>
            </Tabs>
        </div>
    );
}

export default AdminPagePatient;

