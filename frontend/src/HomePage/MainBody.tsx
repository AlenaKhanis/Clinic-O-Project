import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/homePage.css";


type MainBodyProps = {
    userRole: string;
    setShowRegisterPopup: React.Dispatch<React.SetStateAction<boolean>>;
    userName: string;
  }
  
  export function MainBody({ userRole ,setShowRegisterPopup , userName }: MainBodyProps) {

    return (
        <div className='welcome-content' style={{marginTop: "-200px" }}>
          <h1>Welcome to clinic-O</h1>
          <p>Hello {userName}</p>
                  {userRole === 'patient' ? (
            <Link to="/patient">
              <Button>My Space</Button>
            </Link>
          ) : userRole === 'doctor' ? (
            <Link to="/doctor">
              <Button>Doctor Panel</Button>
            </Link>
          ) : userRole === 'owner' ? (
            <Link to="/admin">
              <Button>Admin Panel</Button>
            </Link>
          ) : (
            <Button style={{width: 'fit-content'}} variant="outline-info" onClick={() => setShowRegisterPopup(true)}>Register</Button>
          )}
        </div>
    );
  }