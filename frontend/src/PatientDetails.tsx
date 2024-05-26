import { useState } from 'react';
import { Button, Collapse, ListGroup } from 'react-bootstrap';
import { Patient } from './Types';
import './css/AppointmentSummeryForm.css';
import './css/Tabs.css';

type PatientDetailsProps = {
    patientDetails: Patient | null;
}

const PatientDetails = ({ patientDetails }: PatientDetailsProps) => {
    const [openDiagnosis, setOpenDiagnosis] = useState(false);
    const [openPrescriptions, setOpenPrescriptions] = useState(false);

    return (
        <>
            {patientDetails && (
                <div className="box-main-child">
                    <h2>Patient Details</h2>
                    <p>Patient Name: {patientDetails.full_name}</p>
                    <p>Age: {patientDetails.age}</p>
                    <p>Package: {patientDetails.package}</p>
                    <p>Phone: {patientDetails.phone}</p>
                    <p>Email: {patientDetails.email}</p>
                    <div>
                        <Button
                            style={{ width: 'fit-content', marginBottom: '10px' }}
                            variant="outline-dark"
                            onClick={() => setOpenDiagnosis(!openDiagnosis)}
                            aria-controls="diagnosis-collapse-text"
                            aria-expanded={openDiagnosis}
                        >
                            Diagnosis
                        </Button>
                        <Collapse in={openDiagnosis}>
                            <div id="diagnosis-collapse-text">
                                {Array.isArray(patientDetails.deagnosis) && patientDetails.deagnosis.length > 0 ? (
                                    <ListGroup as="ol" numbered>
                                        {patientDetails.deagnosis.map((diagnosis: string, index: number) => (
                                            <ListGroup.Item as="li" key={index}>{diagnosis}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>NONE</p>
                                )}
                            </div>
                        </Collapse>
                    </div>
                    <div>
                        <Button
                            style={{ width: 'fit-content', marginBottom: '10px' }}
                            variant="outline-dark"
                            onClick={() => setOpenPrescriptions(!openPrescriptions)}
                            aria-controls="prescriptions-collapse-text"
                            aria-expanded={openPrescriptions}
                        >
                            Prescriptions
                        </Button>
                        <Collapse in={openPrescriptions}>
                            <div id="prescriptions-collapse-text">
                                {Array.isArray(patientDetails.prescription) && patientDetails.prescription.length > 0 ? (
                                    <ListGroup as="ol" numbered>
                                        {patientDetails.prescription.map((prescription: string, index: number) => (
                                            <ListGroup.Item as="li" key={index}>{prescription}</ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p>NONE</p>
                                )}
                            </div>
                        </Collapse>
                    </div>
                </div>
            )}
        </>
    );
};

export default PatientDetails;
