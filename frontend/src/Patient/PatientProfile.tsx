import { useEffect, useState } from "react";
import { Patient, PatientProps } from "../Types";
import { Button, Collapse, ListGroup } from "react-bootstrap";
import "../css/PatientProfile.css";
import { usePatientDetails } from "../useFunctions/usePatientDetails";
import EditProfile from "../useFunctions/EditProfileProps";



function PatientProfile({  patientId }: PatientProps) {
    const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);
    const { getPatientById } = usePatientDetails();

    const [openDiagnosis, setOpenDiagnosis] = useState(false);
    const [openPrescription, setOpenPrescription] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);


    useEffect(() => {
        if (patientId) {
            getPatientById(patientId)
                .then((data: Patient) => {
                    setSelectedPatientDetails(data);
                })
                .catch(error => console.error("Error fetching patient details:", error));
        }
    }, [patientId ,showEditModal]);
  
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
                            <Button
                                onClick={() => setOpenDiagnosis(!openDiagnosis)}
                                aria-controls="collapse-diagnosis"
                                aria-expanded={openDiagnosis}
                            >
                                Diagnosis
                            </Button>
                            <Collapse in={openDiagnosis}>
                                <div id="collapse-diagnosis">
                                    {Array.isArray(selectedPatientDetails.diagnosis) && selectedPatientDetails.diagnosis.length > 0 ? (
                                        <ListGroup as="ol" numbered>
                                            {selectedPatientDetails.diagnosis.map((deagnosis, index) => (
                                                <ListGroup.Item as="li" key={index}>{deagnosis}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    ) : (
                                        <p>NONE</p>
                                    )}
                                </div>
                            </Collapse>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                onClick={() => setOpenPrescription(!openPrescription)}
                                aria-controls="collapse-prescription"
                                aria-expanded={openPrescription}
                            >
                                Prescriptions
                            </Button>
                            
                            <Collapse in={openPrescription}>
                                <div id="collapse-prescription">
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
                            </Collapse>
                        </ListGroup.Item>
                        <Button variant='outline-dark' onClick={() => setShowEditModal(true)}>Edit</Button>
                       {selectedPatientDetails && (
                            <EditProfile
                                profile={selectedPatientDetails}
                                onCancel={() => setShowEditModal(false)}
                                showEditModal={showEditModal}
                                isOwner={false}
                            />
                        )}
                    </ListGroup>
                            
                    </>               
            ) : (
                <p>Loading patient profile...</p>
            )}
        </div>
    );
}

export default PatientProfile;
