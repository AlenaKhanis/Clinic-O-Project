
import UserForm from '../UserForm';
import { useNavigate } from 'react-router-dom';

//This component is used to display a registration form UserForm specifically for non-admin users isAdmin={false}.

const Register: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="register-page">
      <UserForm isAdmin={false} onSuccess={() => navigate('/')} />
    </div>
  );
};

export default Register;


