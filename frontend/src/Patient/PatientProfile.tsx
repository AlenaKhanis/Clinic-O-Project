import { useEffect, useState } from "react";
import { useAppointments } from "../DoctorComponents/doctorAppointmentFunction";
import { Patient, PatientProps } from "../Types";
import { Button, ListGroup } from "react-bootstrap";
import "../css/PatientProfile.css";

function PatientProfile({ BACKEND_URL, patientId, refreshAppointments }: PatientProps) {
    const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | void | null>(null);
    const {getPatientById} = useAppointments();

    useEffect(() => {
        if (patientId) {
            getPatientById(patientId)
                .then((data: void | Patient) => {
                    setSelectedPatientDetails(data);
                    // console.log(data);
                });
        }
    }, [patientId, refreshAppointments]);

    const [open, setOpen] = useState(false);

    const [editedFullName, setEditedFullName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [editedPhone, setEditedPhone] = useState("");

    useEffect(() => {
        if (selectedPatientDetails) {
            setEditedFullName(selectedPatientDetails.full_name);
            setEditedEmail(selectedPatientDetails.email);
            setEditedPhone(selectedPatientDetails.phone);
        }
    }, [selectedPatientDetails]);

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
        saveChangesToBackend("full_name", editedFullName);
    };

    const handleSaveEmail = () => {
        saveChangesToBackend("email", editedEmail);
    };

    const handleSavePhone = () => {
        saveChangesToBackend("phone", editedPhone);
    };

    const saveChangesToBackend = (field: string, value: string) => {
        fetch(`${BACKEND_URL}/edit_patient_profile/${patientId}`, {
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

    return (
        <div className="patient-profile-container">
            {selectedPatientDetails ? (
                <>
                    <ListGroup>
                        <h2>Patient Profile</h2>
                        <ListGroup.Item>Full Name: {selectedPatientDetails.full_name}</ListGroup.Item>
                        <ListGroup.Item>Username: {selectedPatientDetails.username}</ListGroup.Item>
                        <ListGroup.Item>Age: {selectedPatientDetails.age}</ListGroup.Item>
                        <ListGroup.Item>Email: {selectedPatientDetails.email}</ListGroup.Item>
                        <ListGroup.Item>Phone: {selectedPatientDetails.phone}</ListGroup.Item>
                        <ListGroup.Item>Package: {selectedPatientDetails.package}</ListGroup.Item>
                        <ListGroup.Item>
                            <div>
                                <p>Diagnosis:</p>
                                {Array.isArray(selectedPatientDetails.deagnosis) && selectedPatientDetails.deagnosis.length > 0 ? (
                                    <ListGroup as="ol" numbered>
                                        {selectedPatientDetails.deagnosis.map((deagnosis, index) => (
                                            <ListGroup.Item as="li" key={index}>{deagnosis}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>NONE</p>
                                )}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <div>
                                <p>Prescriptions:</p>
                                {Array.isArray(selectedPatientDetails.prescription) && selectedPatientDetails.prescription.length > 0 ? (
                                    <ListGroup as="ol" numbered>
                                        {selectedPatientDetails.prescription.map((prescription, index) => (
                                            <ListGroup.Item as="li" key={index}>{prescription}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>NONE</p>
                                )}
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                    <Button
                        onClick={() => setOpen(!open)}
                        aria-controls="collapse-profile-form"
                        aria-expanded={open}
                    >
                        Edit Profile
                    </Button>
                    {open && (
                        <div id="collapse-profile-form" className="container-profile">
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
                    )}
                </>
            ) : (
                <p>Loading patient profile...</p>
            )}
        </div>
    );
}

export default PatientProfile;
