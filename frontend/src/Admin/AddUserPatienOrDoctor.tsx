import React from 'react';
import UserForm from '../UserForm';


interface AdminAddUserProps {
    onPatientAdded: () => void;   // Callback function triggered when a patient is successfully added
    onDoctorAdded: () => void;    // Callback function triggered when a doctor is successfully added
}

const AdminAddUser: React.FC<AdminAddUserProps> = ({ onPatientAdded, onDoctorAdded }) => {
    // Render the AdminAddUser component
    return (
        <div className="admin-add-user-page">
            {/* Render the UserForm component with isAdmin set to true and onSuccess callback */}
            <UserForm isAdmin={true} onSuccess={() => handleSuccess(onPatientAdded, onDoctorAdded)} />
        </div>
    );
};

// Function to handle success of adding both patient and doctor
const handleSuccess = (onPatientAdded: () => void, onDoctorAdded: () => void) => {
    // Call the onPatientAdded and onDoctorAdded callbacks
    onPatientAdded();
    onDoctorAdded();
};

export default AdminAddUser;
