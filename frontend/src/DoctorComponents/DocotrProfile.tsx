import { useEffect, useState } from "react";
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";

import { Doctor, DoctorProps } from "../Types";


import ListGroup from 'react-bootstrap/ListGroup';
import '../css/doctorProfile.css';

/**
 * DoctorProfile component
 * Displays the profile of a specific doctor and allows editing of the profile.
 **/ 

function DoctorProfile({ doctorId}:  DoctorProps ) {
    const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Doctor | null>(null);
  

    const {getDoctorById} = useDoctorAppointments();
    

    
    useEffect(() => {
        if (doctorId) {
            getDoctorById(doctorId)
            .then((data: Doctor) => {
                setSelectedDoctorDetails(data);
            })
        }
    }, [doctorId ]); 

    return (
        <div className="content-container">
            {selectedDoctorDetails ? (
               
                <ListGroup>
                    <h2>Doctor Profile</h2>
                    <ListGroup.Item>Full Name: {selectedDoctorDetails.full_name}</ListGroup.Item>
                    <ListGroup.Item>Username: {selectedDoctorDetails.username}</ListGroup.Item>
                    <ListGroup.Item>Age: {selectedDoctorDetails.age}</ListGroup.Item>
                    <ListGroup.Item>Email: {selectedDoctorDetails.email}</ListGroup.Item>
                    <ListGroup.Item>Phone: {selectedDoctorDetails.phone}</ListGroup.Item>
                    <ListGroup.Item>Specialty: {selectedDoctorDetails.specialty}</ListGroup.Item>
                    
                </ListGroup>
            ) : (
                <p>Loading doctor profile...</p>
            )}
        </div>
    );
}

export default DoctorProfile;
