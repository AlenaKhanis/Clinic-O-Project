import { Tabs, Tab } from 'react-bootstrap';
import 'react-calendar/dist/Calendar.css'; // Import default styles
import '../css/adminPage.css';
import AddApointmet from './AddAppointment';
import DisplayAppointments from './ShowAllAppointments';

function DoctorHomePage() {

    const userInfo = localStorage.getItem('userinfo');
    let doctorId = null;
    if (userInfo) {
        const userInfoObject = JSON.parse(userInfo);
        if (userInfoObject.hasOwnProperty('doctor_id')) {
            doctorId = userInfoObject.doctor_id;
        }
    }

    return (
        <div style={{ width: '700px', height: '700px' }}>
            <Tabs id="uncontrolled-tab-example" className="mb-3">
                <Tab eventKey="home" title="Open Appointments">
                    <AddApointmet />
                </Tab>
                <Tab eventKey="profile" title="Profile">
                    <DisplayAppointments tabKey="profile" doctorId={doctorId} />
                </Tab>
                <Tab eventKey="contact" title="Contact">
                    Tab content for Contact
                </Tab>
            </Tabs>
        </div>
    );
}

export default DoctorHomePage;
