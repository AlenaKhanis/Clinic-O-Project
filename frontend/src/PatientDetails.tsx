
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Collapse, ListGroup } from 'react-bootstrap';
import { Patient } from './Types';
import './css/AppointmentSummeryForm.css';
import './css/Tabs.css';
import { usePatientDetails } from './useFunctions/usePatientDetails';

//TODO: add css

const PatientDetails = () => {
  const { patient_id } = useParams<{ patient_id: string }>();
  const patientIdNumber = Number(patient_id);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [openDiagnosis, setOpenDiagnosis] = useState(false);
  const [openPrescriptions, setOpenPrescriptions] = useState(false);
  const {getPatientById} = usePatientDetails();

    useEffect(() => {
        if (patient_id) {
            getPatientById(patientIdNumber)
            .then((data : Patient) => {
                setPatient(data);
            })
            .catch(error => {
                console.error('Error fetching patient details:', error);
            });
        }
    }, [patientIdNumber]);

  return (
    <>
      {patient && (
        <div className="box-main-child">
          <h2>Patient Details</h2>
          <p>Patient Name: {patient.full_name}</p>
          <p>Age: {patient.age}</p>
          <p>Package: {patient.package}</p>
          <p>Phone: {patient.phone}</p>
          <p>Email: {patient.email}</p>
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
                {Array.isArray(patient.deagnosis) && patient.deagnosis.length > 0 ? (
                  <ListGroup as="ol" numbered>
                    {patient.deagnosis.map((diagnosis: string, index: number) => (
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
                {Array.isArray(patient.prescription) && patient.prescription.length > 0 ? (
                  <ListGroup as="ol" numbered>
                    {patient.prescription.map((prescription: string, index: number) => (
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
