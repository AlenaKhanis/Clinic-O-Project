import { useEffect, useState } from "react";
import { useAppointments } from "./doctorAppointmentFunction";
import { DisplayAppointmentsProps } from "../Types";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

function DoctorProfile({ doctorId, onAppointmentAdded }: DisplayAppointmentsProps) {
    const { getDoctordetails, selectedDoctorDetails } = useAppointments();
    const [open, setOpen] = useState(false);

    
      const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        // Handle form submission (e.g., send data to backend)
      };

    useEffect(() => {
        if (doctorId) {
            getDoctordetails(doctorId);
        }
    }, [doctorId, onAppointmentAdded]); 


    return (
        <div>
            {selectedDoctorDetails ? (
                <>
                <ListGroup>
                    <h2>Doctor Profile</h2>
                    <ListGroup.Item>Full Name: {selectedDoctorDetails.full_name}</ListGroup.Item>
                    <ListGroup.Item>Username: {selectedDoctorDetails.username}</ListGroup.Item>
                    <ListGroup.Item>Age: {selectedDoctorDetails.age}</ListGroup.Item>
                    <ListGroup.Item>Email: {selectedDoctorDetails.email}</ListGroup.Item>
                    <ListGroup.Item>Phone: {selectedDoctorDetails.phone}</ListGroup.Item>
                    <ListGroup.Item>Specialty: {selectedDoctorDetails.specialty}</ListGroup.Item>
                </ListGroup>
                
                <Button
                    onClick={() => setOpen(!open)}
                    aria-controls="example-collapse-text"
                    aria-expanded={open}
                >
                    Edit Profile
                </Button>
                <Collapse in={open}>
                    <div id="example-collapse-text">
                    <div>
                        <h2>Edit Profile</h2>
                        <form onSubmit={handleSubmit}>
                            <label>Full Name:</label>
                            <input
                            type="text"
                            name="firstName"
                            required
                            />
                            <button type="submit">Save Changes</button>
                        </form>
                        </div>
                    </div>
                </Collapse>
                </>
            ) : (
                <p>Loading doctor profile...</p>
            )}
        </div>
    );
}

export default DoctorProfile;
