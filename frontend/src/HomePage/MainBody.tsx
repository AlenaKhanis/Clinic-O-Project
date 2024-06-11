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

function MainBody({ userRole , setShowLoginPopup }: HomePageProps) {

  return (
    <>
      <h1>Welcome clinic-O <br />Caring for You<br /> Caring for Life</h1>
      {userRole === 'patient' ? (
        <Link to="/patient">
          <Button className="main-button" variant="outline-dark">My Space</Button>
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
    </>
  );
}

export default MainBody;
