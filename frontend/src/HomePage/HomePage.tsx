
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import '../css/App.css';
import '../css/homePage.css';
import { Link } from 'react-router-dom';
import "../css/homePage.css"



type MainBodyProps = {
  userRole: string;
  setShowRegisterPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MainBody({ userRole ,setShowRegisterPopup }: MainBodyProps) {


  return (
    <>
      <div className='welcome-content' style={{marginTop: "-200px" }}>
        <h1>Hello {userRole}</h1>
        <p>Welcome to clinic-O</p>
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
          <Button onClick={() => setShowRegisterPopup(true)}>Register</Button>
        )}
      </div>
    </>
  );
}

//TODO: export function UserRoleDisplay(){}
type MainPage = {
  setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setShowLogo: React.Dispatch<React.SetStateAction<boolean>>;
  showLogo: boolean;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
}


function MainPage({ setShowLoginPopup , setShowLogo , showLogo ,setUserName ,setUserToken}: MainPage) {

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Link to="/" style={{ textDecoration: 'none' }}>
          <Navbar.Brand >Clinic-O</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                        <Nav.Link onClick={() => { 
                if (showLogo) {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("userinfo");
                  setUserToken(null);
                  setUserName("");
                  setShowLogo(false);
                    setShowLogo(false);
                } else {
                    setShowLoginPopup(true);
                }
            }}>
                {showLogo ? "Logout" : "Login"}
            </Nav.Link>
              <Nav.Link href="link">Link</Nav.Link>
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            <Nav.Item>Role</Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MainPage;
