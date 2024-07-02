import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// NotFoundPage component that handles the "Page Not Found" scenario

export const NotFoundPage = ({ userRole }: { userRole: string }) => {
    const navigate = useNavigate();
    console.log(userRole);
    const handleGoBack = () => {
        switch (userRole) {
            case 'owner':
                navigate('/admin');
                break;
            case 'patient':
                navigate('/patient');
                break;
            case 'doctor':
                navigate('/doctor');
                break;    
            default:
                navigate('/');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center'
        }}>
            <h1>404 - Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Button variant="dark" style={{width: 'fit-content'}} onClick={handleGoBack}>Go Back</Button>
        </div>
    );
};

export default NotFoundPage;