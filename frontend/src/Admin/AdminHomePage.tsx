import { Tab, Tabs } from "react-bootstrap";
import '../css/Tabs.css';


function AdminPagePatient() {

    return (
        <div style={{ width: '900px', height: '700px' }}>
            <Tabs  id="uncontrolled-tab-example" className="mb-3" style={{backgroundColor: "#f1f1f2"}}>
                <Tab eventKey=" Clinic Details" title="Clinic Details" className="tabs">
                </Tab>
                <Tab eventKey="Doctors" title="Doctors" className="tabs">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="contact" title="Contact" className="tabs">
                    Tab content for Contact
                </Tab>
            </Tabs>
        </div>
    );
}

export default AdminPagePatient;

