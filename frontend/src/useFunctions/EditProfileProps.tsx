import { useState, useEffect } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { Doctor, Patient, Owner } from '../Types';

type EditProfileProps = {
  profile: Doctor | Patient | Owner;
  onSaveDoctorChanges: (editedDoctor: Doctor) => void;
  onSavePatientChanges: (editedPatient: Patient) => void;
  onSaveOwnerChanges: (editedOwner: Owner) => void;
  onCancel: () => void;
  showEditModal: boolean;
};

export default function EditProfile({ profile, onSaveDoctorChanges, onSavePatientChanges, onSaveOwnerChanges, onCancel, showEditModal }: EditProfileProps) {
  const [editedProfile, setEditedProfile] = useState<Doctor | Patient | Owner>(profile);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');

  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const [userRole, setRole] = useState<string>(() => {
    const userinfo = localStorage.getItem('userinfo');
    if (userinfo) {
      const { role } = JSON.parse(userinfo);
      return role;
    } else {
      return "";
    }
  });

  console.log(userRole);
  
  const handleSaveChanges = () => {
    if (isDoctorProfile(editedProfile) && userRole=== 'admin') {
      onSaveDoctorChanges(editedProfile as Doctor);
    } else if (isPatientProfile(editedProfile)) {
      onSavePatientChanges(editedProfile as Patient);
    } else if (isOwnerProfile(editedProfile) && userRole=== 'admin') {
      onSaveOwnerChanges(editedProfile as Owner);
    } else {
      // Handle other profile types or show an error
      console.error('Invalid profile type for editing');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prevProfile => ({
      ...prevProfile,
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
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && (
          <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
            {alertMessage}
          </Alert>
        )}
        <Form>
          <Form.Group controlId="formProfileName">
            Name:
            <Form.Control
              type="text"
              name="full_name"
              value={editedProfile.full_name}
              onChange={handleChange}
            />
          </Form.Group>
          {userRole === 'admin' && (
            <Form.Group controlId="formProfileSpecialty">
              Specialty:
              <Form.Control
                type="text"
                name="specialty"
                value={(editedProfile as Doctor).specialty} // Only available for doctor profile
                onChange={handleChange}
              />
            </Form.Group>
          )}
          {userRole === 'patient' && (
            <Form.Group controlId="formProfilePackage">
              Package:
              <Form.Control
                type="text"
                name="package"
                value={(editedProfile as Patient).package} // Only available for patient profile
                onChange={handleChange}
              />
            </Form.Group>
          )}
          {/* Additional form fields based on user's role */}
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

function isDoctorProfile(profile: Doctor | Patient | Owner): profile is Doctor {
  return 'doctor_id' in profile;
}

function isPatientProfile(profile: Doctor | Patient | Owner): profile is Patient {
  return 'patient_id' in profile;
}

function isOwnerProfile(profile: Doctor | Patient | Owner): profile is Owner {
  return 'owner_id' in profile;
}
