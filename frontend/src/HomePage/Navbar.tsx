import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/homePage.css';
import { Link } from 'react-router-dom';

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
};

function HomeNavBar({  userToken , userName }: HomePageProps) {

  const [date, setDate] = useState(new Date());
  const hour = date.getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const formattedDate = format(date, 'PPpp');

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  
  return (
    //TODO: add side bar - for profile view + sign out + maybe settings.
    <>
  <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
    <Container fluid> 
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Navbar.Brand style={{color: 'white'}}>Clinic-O</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link style={{color: 'white' , textDecoration: 'none'}}  href="/register" >Register</Nav.Link> 
          <Nav.Link style={{color: 'white'}} href="link">Link</Nav.Link> 
        </Nav>
        <Nav.Item>{greeting}, {userToken ? userName : "Guest"}.<br></br> {formattedDate}.</Nav.Item> 
        <OffCanvasExample placement="end" />
      </Navbar.Collapse>
    </Container>
  </Navbar>
</>
  );
}

export default HomeNavBar;
