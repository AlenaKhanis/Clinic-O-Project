
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import '../css/App.css';
import '../css/homePage.css';


type MainBodyProps = {
  userName: string;
  setShowRegisterPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MainBody({ userName }: MainBodyProps) {
  return (
    <>
      <div className='welcome-content'>
        <h1>Hello {userName}</h1>
        <p>Welcome to clinic-O</p>
      </div>
    </>
  );
}

//TODO: export function UserRoleDisplay(){}


function MainPage({ setShowLoginPopup }: { setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>> }) {

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Clinic-O</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link  onClick={() => { setShowLoginPopup(true) }}>Login</Nav.Link>
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
