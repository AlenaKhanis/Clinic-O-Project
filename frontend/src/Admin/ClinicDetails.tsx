import { useEffect, useState } from 'react';
import { Clinic, OwnerProps } from '../Types';
import Alert from 'react-bootstrap/Alert';
import { Button } from 'react-bootstrap';

function ClinicDetails({ BACKEND_URL }: OwnerProps) {
  const [clinicDetails, setClinicDetails] = useState<Clinic | null>(null);
  const [editing, setEditing] = useState(false);
  const [editedClinicName, setEditedClinicName] = useState('');
  const [editedClinicAddress, setEditedClinicAddress] = useState('');
  const [editedClinicPhone, setEditedClinicPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setEditedClinicName(data.clinic_name);
        setEditedClinicAddress(data.clinic_address);
        setEditedClinicPhone(data.clinic_phone);
      })
      .catch((error) => {
        console.error('Error fetching clinic details:', error);
        setErrorMessage('Error fetching clinic details');
      });
  }, [BACKEND_URL]);

  const handleEditToggle = () => {
    setEditing(!editing);
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
      .then(data => {
        setClinicDetails(prevDetails => ({ ...prevDetails, [field]: value } as Clinic));
        setSuccessMessage('Clinic details updated successfully');
        setErrorMessage(null);
      })
      .catch((error) => {
        console.error('Error updating clinic details:', error);
        setErrorMessage('An error occurred while updating the clinic details');
        setSuccessMessage(null);
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
    }
  };

  return (
    <div>
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
            <p>Description: {clinicDetails.clinic_description}</p>
            <Button variant='outline-dark' onClick={handleEditToggle}>
              {editing ? 'Cancel' : 'Edit Clinic Details'}
            </Button>
            {editing && (
              <div className="container-profile">
                <form onSubmit={handleSubmit}>
                  <label>
                    Clinic Name:
                    <input
                      type="text"
                      value={editedClinicName}
                      onChange={(e) => setEditedClinicName(e.target.value)}
                    />
                  </label>
                  <label>
                    Clinic Address:
                    <input
                      type="text"
                      value={editedClinicAddress}
                      onChange={(e) => setEditedClinicAddress(e.target.value)}
                    />
                  </label>
                  <label>
                    Clinic Phone:
                    <input
                      type="text"
                      value={editedClinicPhone}
                      onChange={(e) => setEditedClinicPhone(e.target.value)}
                    />
                  </label>
                  <Button variant='outline-dark' type="submit">Save</Button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ClinicDetails;
