import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/homePage.css";

type HomePageProps = {
  setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  userRole: string;
  userToken: string | null;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>
};

/**
 * The MainBody component is a functional component that displays a welcome message and a button
 * based on the user's role. Depending on the user's role, it shows different buttons that link
 * to different panels (patient, doctor, or admin). If the user is not logged in, it shows a login
 * button that triggers a login popup.
 */

function MainBody({ userRole , setShowLoginPopup }: HomePageProps) {

  return (
    <div className="main-div">
       <div className="text-container">
          <h1 className="special-heading">Welcome Clinic-O</h1>
          <span className="subheading">Caring for You Caring for Life</span>
        </div>
      {userRole === 'patient' ? (
        <Link to="/patient">
          <Button className="main-button" variant="outline-dark">Panel</Button>
        </Link>
      ) : userRole === 'doctor' ? (
        <Link to="/doctor">
          <Button className="main-button" variant="outline-dark">Doctor Panel</Button>
        </Link>
      ) : userRole === 'owner' ? (
        <Link to="/admin">
          <Button className="main-button" variant="outline-dark">Admin Panel</Button>
        </Link>
      ) : (
        <Button onClick={() => setShowLoginPopup(true)} className="main-button" variant="outline-dark" >
          Login
        </Button>
      )}
      
    </div>
  );
}

export default MainBody;
