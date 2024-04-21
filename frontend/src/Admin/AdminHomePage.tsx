import { Tab, Tabs } from "react-bootstrap";


function AdminPagePatient() {

    return (
        <div style={{ width: '700px', height: '700px' }}>
            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="home" title="Open Appointments">
                </Tab>
                <Tab eventKey="profile" title="Profile">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="contact" title="Contact">
                    Tab content for Contact
                </Tab>
            </Tabs>
        </div>
    );
}

export default AdminPagePatient;
