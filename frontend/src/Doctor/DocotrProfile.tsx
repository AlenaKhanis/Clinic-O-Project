import { useEffect, useState } from "react";
import { useAppointments } from "./doctorAppointmentFunction";
import { DisplayAppointmentsProps } from "../Types";
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import '../css/doctorProfile.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

function DoctorProfile({ doctorId, onAppointmentAdded }: DisplayAppointmentsProps) {
    const { getDoctordetails, selectedDoctorDetails } = useAppointments();
    const [open, setOpen] = useState(false);

    const [editedFullName, setEditedFullName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [editedPhone, setEditedPhone] = useState("");


    useEffect(() => {
        if (selectedDoctorDetails) {
            setEditedFullName(selectedDoctorDetails.full_name);
            setEditedEmail(selectedDoctorDetails.email);
            setEditedPhone(selectedDoctorDetails.phone);
        }
    }, [selectedDoctorDetails]);

    const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedFullName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedEmail(e.target.value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditedPhone(e.target.value);
    };

    const handleSaveFullName = () => {
        // Send editedFullName to the backend to update the full name
        saveChangesToBackend("full_name", editedFullName);
    };

    const handleSaveEmail = () => {
        // Send editedEmail to the backend to update the email
        saveChangesToBackend("email", editedEmail);
    };

    const handleSavePhone = () => {
        // Send editedPhone to the backend to update the phone number
        saveChangesToBackend("phone", editedPhone);
    };


    useEffect(() => {
        if (doctorId) {
            getDoctordetails(doctorId);
        }
    }, [doctorId, onAppointmentAdded]); 



    const saveChangesToBackend = (field: string, value: string) => {
        fetch(`${BACKEND_URL}/edit_doctor_profile/${doctorId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ field, value }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
         
            console.log(`Updated ${field} successfully!`);
        })
        .catch((error) => {
            console.error(`Error updating ${field}:`, error);
            
        });
    };

    

    //TODO: Add saparate lable for firs name and lasn name 
    //TODO: add ref 
  

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
                    <div className="container-profile">
                        <h2>Edit Profile</h2>
                        <label>Full Name:</label>
                        <input
                            type="text"
                            value={editedFullName}
                            onChange={handleFullNameChange}                                
                        />
                        <Button onClick={handleSaveFullName}>Save</Button>
                        <br />
                        <label>Email:</label>
                        <input
                            type="email"
                            value={editedEmail}
                            onChange={handleEmailChange}  
                        />
                        <Button onClick={handleSaveEmail}>Save</Button>
                        <br />
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            value={editedPhone}
                            onChange={handlePhoneChange}
                        />
                        <Button onClick={handleSavePhone}>Save</Button>
                        <br />
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
