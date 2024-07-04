import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/homePage.css';

import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { OffCanvasExample } from './OffCanvas';



type HomePageProps = {
  setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userToken?: string | null;
  setRole: React.Dispatch<React.SetStateAction<string>>;
  userName: string;
  role: string;
  subId: string | null;
};

/**
 * The HomeNavBar component renders a responsive navigation bar for the Clinic-O application.
 * It includes links for navigation, user-specific actions (login/logout), and displays a greeting 
 * with the current date and time. The navigation bar adjusts based on the user's role and login status.
 */

function HomeNavBar({ userToken, userName , setShowLoginPopup, setUserName, setRole, setUserToken , role ,subId }: HomePageProps) {
  const [date, setDate] = useState(new Date());
  const hour = date.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const formattedDate = format(date, 'PPpp');
  const navigate = useNavigate();



  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  function logOut() {
    if (userToken) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("userinfo");
      setUserToken(null);
      setUserName("Guest");
      setRole("");
      navigate("/");
    } else {
      setShowLoginPopup(true);
    }
  }


  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container fluid>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Navbar.Brand style={{ color: 'white' }}>Clinic-O</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto align-items-center">
              {userToken ? (
                <Nav.Link onClick={() => logOut()} style={{ color: 'white', textDecoration: 'none' }}>
                  Logout
                </Nav.Link>
              ) : (
                <Link to='/register' style={{ textDecoration: 'none' }}>
                  <Navbar.Text className="ms-3" style={{ color: 'white' }}>
                    Register
                  </Navbar.Text>
                </Link>
              )}
              {role === 'owner' &&
                <Link to='/admin' style={{ textDecoration: 'none' }}>
                  <Navbar.Text className="ms-3" style={{ color: 'white' }}>Actions</Navbar.Text>
                </Link>
              }
              {role === 'patient' &&
                <Link to='/patient' style={{ textDecoration: 'none' }}>
                  <Navbar.Text className="ms-3" style={{ color: 'white' }}>Actions</Navbar.Text>
                </Link>
              }
              {role === 'doctor' &&
                <Link to='/doctor' style={{ textDecoration: 'none' }}>
                  <Navbar.Text className="ms-3" style={{ color: 'white' }}>Actions</Navbar.Text>
                </Link>
              }
              {role !== 'owner' && role !== 'doctor' && role !== 'patient' &&
                <Link to='/about' style={{ textDecoration: 'none' }}>
                  <Navbar.Text className="ms-3" style={{ color: 'white' }}>About</Navbar.Text>
                </Link>
              }
              {role === 'patient' ? (
                <Link to="/patient" style={{ textDecoration: 'none' }}>
                  <Navbar.Text className="ms-3" style={{ color: 'white' }} >Panel</Navbar.Text>
                </Link>
              ) : role === 'doctor' ? (
                <Link to="/doctor" style={{ textDecoration: 'none' }}>
                  <Navbar.Text className="ms-3" style={{ color: 'white' }}>Doctor Panel</Navbar.Text>
                </Link>
              ) : role === 'owner' ? (
                <Link to="/admin" style={{ textDecoration: 'none' }}>
                  <Navbar.Text className="ms-3" style={{ color: 'white' }} >Admin Panel</Navbar.Text>
                </Link>
              ) : (
                <Navbar.Text className="ms-3" style={{ color: 'white' ,cursor: 'pointer'   }} onClick={() => setShowLoginPopup(true)} >
                  Login
                </Navbar.Text>
              )}
            </Nav>
            <Nav className="ms-auto align-items-center">
              <Nav.Item className="text-white ms-3">{greeting}, {userToken ? userName : "Guest"}.<br /> {formattedDate}.</Nav.Item>
              <OffCanvasExample placement="end" role={role} subId={subId} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}  

export default HomeNavBar;
