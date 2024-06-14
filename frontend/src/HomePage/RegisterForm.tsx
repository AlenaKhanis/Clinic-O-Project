// Register.tsx
import UserForm from '../UserForm';

const Register: React.FC = () => {
  return (
    <div className="register-page">
      <UserForm isAdmin={false} onSuccess={() => window.location.href = '/'} />
    </div>
  );
};

export default Register;


