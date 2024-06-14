import React from 'react';
import UserForm from '../UserForm';

interface AdminAddUserProps {
    onPatientAdded: () => void;
    onDoctorAdded: () => void;
}

const AdminAddUser: React.FC<AdminAddUserProps> = ({ onPatientAdded, onDoctorAdded }) => {
    return (
        <div className="admin-add-user-page">
            <UserForm isAdmin={true} onSuccess={() => handleSuccess(onPatientAdded, onDoctorAdded)} />
        </div>
    );
};

const handleSuccess = (onPatientAdded: () => void, onDoctorAdded: () => void) => {
    onPatientAdded();
    onDoctorAdded();
};

export default AdminAddUser;
