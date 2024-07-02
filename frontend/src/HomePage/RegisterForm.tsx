
import UserForm from '../UserForm';

//This component is used to display a registration form UserForm specifically for non-admin users isAdmin={false}.

const Register: React.FC = () => {
  return (
    <div className="register-page">
      <UserForm isAdmin={false} onSuccess={() => window.location.href = '/'} />
    </div>
  );
};

export default Register;


