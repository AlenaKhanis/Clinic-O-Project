import React, { useEffect, useState } from 'react';
import { Doctor, OwnerProps } from '../Types';
import Alert from 'react-bootstrap/Alert';
import { Button, Modal, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDoctorAppointments } from '../useFunctions/useDoctorAppointments';
import '../css/doctorProfile.css';

function DoctorProfile({ BACKEND_URL }: OwnerProps) {
  const { doctorId } = useParams<{ doctorId: string }>();
  const doctorID = Number(doctorId);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');
  const {getDoctorById} = useDoctorAppointments();

  useEffect(() => {
    if (doctorID) {
      getDoctorById(doctorID)
        .then((data: Doctor) => {
          setDoctor(data);
        })
        .catch(error => console.error('Error fetching doctor:', error));
    }
  }, [doctorID]);

  const handleDelete = () => {
    if (doctor) {
      fetch(`${BACKEND_URL}/delete_doctor/${doctor.doctor_id}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          setAlertMessage('Doctor deleted successfully');
          setAlertVariant('success');
          setShowAlert(true);
        })
        .catch((error) => {
          console.error('Error deleting doctor:', error);
          setAlertMessage('Error deleting doctor');
          setAlertVariant('danger');
          setShowAlert(true);
        });
    }
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    setEditingDoctor(doctor);
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    if (editingDoctor) {
      fetch(`${BACKEND_URL}/doctors/${editingDoctor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDoctor),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          setDoctor(editingDoctor);
          setAlertMessage('Doctor updated successfully');
          setAlertVariant('success');
          setShowAlert(true);
          setShowEditModal(false);
        })
        .catch((error) => {
          console.error('Error updating doctor:', error);
          setAlertMessage('Error updating doctor');
          setAlertVariant('danger');
          setShowAlert(true);
        });
    }
  };

  return (
    <div className='container-profile' style={{ marginTop: '250px' }}  >
      {showAlert && (
        <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
      {doctor && (
        <>
          <h1>Dr.{doctor.full_name}</h1>
          <p>Specialty: {doctor.specialty}</p>
          <p>Email: {doctor.email}</p>
          <p>Phone: {doctor.phone}</p>
          <Button variant='outline-dark' onClick={handleEdit}>Edit</Button>
          <Button variant='outline-danger' onClick={() => setShowDeleteModal(true)}>Delete</Button>
        </>
      )}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingDoctor && (
            <Form>
              <Form.Group controlId="formDoctorName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingDoctor.full_name}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, full_name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="formDoctorSpecialty">
                <Form.Label>Specialty</Form.Label>
                <Form.Control
                  type="text"
                  value={editingDoctor.specialty}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save changes</Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete Dr. {doctor?.full_name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorProfile;
