import React, { useEffect, useState } from 'react';
import { useBackendUrl } from '../BackendUrlContext';
import { Clinic } from '../Types';


import Alert from 'react-bootstrap/Alert';
import { Button, Modal, Form } from 'react-bootstrap';


/*
  ClinicDetails component
  Fetches and displays the clinic details
  Allows the admin to edit the clinic details
*/



function ClinicDetails() {
  const [clinicDetails, setClinicDetails] = useState<Clinic | null>(null);
  
  const [editing, setEditing] = useState(false);
  const [editedClinicName, setEditedClinicName] = useState('');
  const [editedClinicAddress, setEditedClinicAddress] = useState('');
  const [editedClinicPhone, setEditedClinicPhone] = useState('');
  const [editedClinicDescription, setEditedClinicDescription] = useState('');
  const [editedClinicEmail, setEditedClinicEmail] = useState('');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);


  const BACKEND_URL = useBackendUrl();


  useEffect(() => {
    fetch(`${BACKEND_URL}/clinic_details`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Clinic) => {
        setClinicDetails(data);
        console.log(data.clinic_email);
        setEditedClinicName(data.clinic_name);
        setEditedClinicAddress(data.clinic_address);
        setEditedClinicPhone(data.clinic_phone);
        setEditedClinicDescription(data.clinic_description);
        setEditedClinicEmail(data.clinic_email);
      })
      .catch((error) => {
        console.error('Error fetching clinic details:', error);
        setErrorMessage('Error fetching clinic details');
      });
  }, []);

  const handleEditToggle = () => {
    setEditing(!editing);
    setShowModal(true);
  };

  const updateClinicDetail = (field: string, value: string) => {
    fetch(`${BACKEND_URL}/update_clinic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field, value }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(() => {
        setClinicDetails(prevDetails => ({ ...prevDetails, [field]: value } as Clinic));
        setSuccessMessage('Clinic details updated successfully');
        setErrorMessage(null);
        setShowModal(false);
        handleMassageTime();
      })
      .catch(error => {
        console.error('Error updating clinic details:', error);
        setErrorMessage('An error occurred while updating the clinic details');
        setSuccessMessage(null);
        handleMassageTime();
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();


    if (clinicDetails) {
        if (editedClinicName !== clinicDetails.clinic_name) {
            updateClinicDetail('clinic_name', editedClinicName);
        }
        if (editedClinicAddress !== clinicDetails.clinic_address) {
            updateClinicDetail('clinic_address', editedClinicAddress);
        }
        if (editedClinicPhone !== clinicDetails.clinic_phone) {
            updateClinicDetail('clinic_phone', editedClinicPhone);
        }
        if (editedClinicDescription !== clinicDetails.clinic_description) {
            updateClinicDetail('clinic_description', editedClinicDescription);
        }
        if (editedClinicEmail !== clinicDetails.clinic_email) {
            updateClinicDetail('clinic_email', editedClinicEmail);
        }
        
    }

    setShowModal(false);
  };

  const handleMassageTime = () => {
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 2000);
  }

  return (
    <div className='content-container'>
      <h1>Clinic Details</h1>
      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)} dismissible>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
          {errorMessage}
        </Alert>
      )}
      <div>
        {clinicDetails && (
          <>
            <p>Name: {clinicDetails.clinic_name}</p>
            <p>Address: {clinicDetails.clinic_address}</p>
            <p>Phone: {clinicDetails.clinic_phone}</p>
            <p>Email: {clinicDetails.clinic_email}</p>
            <p>Description: {clinicDetails.clinic_description}</p>
            <Button variant='outline-dark' onClick={handleEditToggle}>
              Edit Clinic Details
            </Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Clinic Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formClinicName">
                    <Form.Label>Clinic Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedClinicName}
                      onChange={(e) => setEditedClinicName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formClinicAddress">
                    <Form.Label>Clinic Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedClinicAddress}
                      onChange={(e) => setEditedClinicAddress(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formClinicPhone">
                    <Form.Label>Clinic Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedClinicPhone}
                      onChange={(e) => setEditedClinicPhone(e.target.value)}
                      
                    />

                  </Form.Group>
                  <Form.Group controlId="formClinicEmail">
                    <Form.Label>Clinic Email</Form.Label>
                    <Form.Control
                      type="text"
                      value={editedClinicEmail}
                      onChange={(e) => setEditedClinicEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group controlId="formClinicDescription">
                    <Form.Label>Clinic Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={editedClinicDescription}
                      onChange={(e) => setEditedClinicDescription(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}

export default ClinicDetails;
