// AdminAddUser.tsx
import UserForm from '../UserForm';

const AdminAddUser = () => {
  return (
    <div className="admin-add-user-page">
      <UserForm isAdmin={true} onSuccess={() => console.log('User added successfully')} />
    </div>
  );
};

export default AdminAddUser;
