import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { Doctor } from '../Types';

type EditDoctorProfileProps = {
  doctor: Doctor;
  onSaveChanges: (editedDoctor: Doctor, setAlert: (message: string, variant: 'success' | 'danger') => void) => void;
  onCancel: () => void;
  showEditModal: boolean;
};

export default function EditDoctorProfile({ doctor, onSaveChanges, onCancel, showEditModal }: EditDoctorProfileProps) {
  const [editedDoctor, setEditedDoctor] = useState<Doctor>(doctor);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    setEditedDoctor(doctor);
  }, [doctor]);

  const handleSaveChanges = () => {
    onSaveChanges(editedDoctor, (message, variant) => {
      setAlertMessage(message);
      setAlertVariant(variant);
      setShowAlert(true);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedDoctor(prevDoctor => ({
      ...prevDoctor,
      [name]: value
    }));
  };
  

  const handleCloseModal = () => {
    onCancel();
    setShowAlert(false);
    setAlertMessage(null);
    setAlertVariant('success');

  };

  return (
    <Modal show={showEditModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Doctor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        <Form>
          <Form.Group controlId="formDoctorName">
            Name:
            <Form.Control
              type="text"
              name="full_name"
              value={editedDoctor.full_name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formDoctorSpecialty">
            Specialty:
            <Form.Control
              type="text"
              name="specialty"
              value={editedDoctor.specialty}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

