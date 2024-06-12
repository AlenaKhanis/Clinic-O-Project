import { useState, useEffect } from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { Doctor, Patient, Owner } from '../Types';
import { validateUsername, validateEmail, validateFullName, validatePhone, validateSpecialty } from '../validations'; // Adjust the path as needed

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [changedFields, setChangedFields] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setEditedProfile(profile);
    setChangedFields({});
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

  const handleSaveChanges = async () => {
    const validationErrors: { [key: string]: string } = {};

    if (changedFields.full_name) {
      validationErrors.full_name = validateFullName(editedProfile.full_name);
    }
    if (changedFields.email) {
      validationErrors.email = validateEmail(editedProfile.email);
    }
    if (changedFields.phone) {
      validationErrors.phone = validatePhone(editedProfile.phone);
    }
    if (changedFields.username) {
      validationErrors.username = await validateUsername(editedProfile.username, BACKEND_URL);
    }
    if (changedFields.specialty && isDoctorProfile(editedProfile) && userRole === 'owner') {
      validationErrors.specialty = validateSpecialty((editedProfile as Doctor).specialty);
    }

    const hasErrors = Object.values(validationErrors).some((error) => error !== "");
    setErrors(validationErrors);

    if (!hasErrors) {
      if (isDoctorProfile(editedProfile) && userRole === 'owner') {
        onSaveDoctorChanges(editedProfile as Doctor);
      } else if (isPatientProfile(editedProfile)) {
        onSavePatientChanges(editedProfile as Patient);
      } else if (isOwnerProfile(editedProfile) && userRole === 'owner') {
        onSaveOwnerChanges(editedProfile as Owner);
      } else {
        console.error('Invalid profile type for editing');
      }
    } else {
      setShowAlert(true);
      setAlertMessage('Please fix the errors before saving.');
      setAlertVariant('danger');
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));

    setChangedFields(prevChangedFields => ({
      ...prevChangedFields,
      [name]: true
    }));

    const validationErrors = { ...errors };

    if (name === 'full_name') {
      validationErrors.full_name = validateFullName(value);
    } else if (name === 'email') {
      validationErrors.email = validateEmail(value);
    } else if (name === 'phone') {
      validationErrors.phone = validatePhone(value);
    } else if (name === 'username') {
      validationErrors.username = await validateUsername(value, BACKEND_URL);
    } else if (name === 'specialty' && userRole === 'owner') {
      validationErrors.specialty = validateSpecialty(value);
    }

    setErrors(validationErrors);
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
            <Form.Label>Name:</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={editedProfile.full_name}
              onChange={handleChange}
              isInvalid={!!errors.full_name}
            />
            <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formProfileUsername">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={editedProfile.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formProfileEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formProfilePhone">
            <Form.Label>Phone:</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={editedProfile.phone}
              onChange={handleChange}
              isInvalid={!!errors.phone}
            />  
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>

          {userRole === 'owner' && (
            <Form.Group controlId="formProfileSpecialty">
              <Form.Label>Specialty:</Form.Label>
              <Form.Control
                type="text"
                name="specialty"
                value={(editedProfile as Doctor).specialty} // Only available for doctor profile
                onChange={handleChange}
                isInvalid={!!errors.specialty}
              />
              <Form.Control.Feedback type="invalid">{errors.specialty}</Form.Control.Feedback>
            </Form.Group>
          )}
          {userRole === 'patient' && (
            <Form.Group controlId="formProfilePackage">
              <Form.Label>Package:</Form.Label>
              <Form.Control
                type="text"
                name="package"
                value={(editedProfile as Patient).package} // Only available for patient profile
                onChange={handleChange}
              />
            </Form.Group>
          )}
          
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
