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
            <Nav className="me-auto">
            {userToken ? (
              <Nav.Link onClick={() => logOut()} style={{ color: 'white', textDecoration: 'none' }}>
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link style={{ color: 'white', textDecoration: 'none' }} href="/register">
                Register
              </Nav.Link>
            )}
              {role === 'owner' && <Nav.Link style={{ color: 'white' }}  href={`/admin`}>Actions</Nav.Link>}
              {role === 'doctor' && <Nav.Link style={{ color: 'white' }} href={`/doctor`}>Actions</Nav.Link>}
              {role === 'patient' && <Nav.Link style={{ color: 'white' }} href={`/patient`}>Actions</Nav.Link>}
              {role !== 'owner' && role !== 'doctor' && role !== 'patient' && <Nav.Link style={{ color: 'white' }} href="/about">About</Nav.Link>} 
            </Nav>
            <Nav.Item>{greeting}, {userToken ? userName : "Guest"}.<br /> {formattedDate}.</Nav.Item>
            <OffCanvasExample placement="end" role={role} subId={subId} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default HomeNavBar;
