
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import '../css/App.css';
import '../css/homePage.css';


export function MainBody({ setShowRegisterPopup }: { setShowRegisterPopup: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <>
      <div className='welcome-content'>
        <h1>Hello Guest</h1> {/* TODO: when login set the name */}
        <p>Welcome to clinic-O</p>
        <Button variant="primary" onClick={() => setShowRegisterPopup(true)}>Register</Button>
      </div>
    </>
  );
}

function MainPage({ setShowLoginPopup }: { setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>> }) {

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Clinic-O</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#login" onClick={() => { setShowLoginPopup(true) }}>Login</Nav.Link>
              <Nav.Link href="link">Link</Nav.Link>
              <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav.Item>Role</Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MainPage;
