import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/homePage.css";
  
  export function MainBody({ userRole }: {userRole: string}) {

    return (
        <>
          <h1>Welcome clinic-O <br></br>Caring for You<br></br> Caring for Life</h1>
          {/* <p>Hello {userName}</p> */}
                          {userRole === 'patient' ? (
                    <Link to="/patient" >
                      <Button className="main-button" variant="outline-dark" >My Space</Button>
                    </Link>
                  ) : userRole === 'doctor' ? (
                    <Link to="/doctor">
                      <Button className="main-button"  variant="outline-dark">Doctor Panel</Button>
                    </Link>
                  ) : userRole === 'owner' ? (
                    <Link to="/admin">
                      <Button className="main-button"  variant="outline-dark">Admin Panel</Button>
                    </Link>
                  ) : (
                    <Link to="/register" className="main-button">Register</Link>
                  )}
      </>
    );
  }
export default MainBody;
