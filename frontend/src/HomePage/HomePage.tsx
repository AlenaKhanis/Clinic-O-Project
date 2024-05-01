import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css';
import '../css/homePage.css';
import { Link } from 'react-router-dom';
import "../css/homePage.css";
import { useNavigate } from 'react-router-dom';

type HomePageProps = {
  setShowLoginPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  userRole: string;
  userToken?: string | null;
  setRole: React.Dispatch<React.SetStateAction<string>>;
};

function HomePage({ setShowLoginPopup , setUserName , setUserToken , userRole , userToken ,setRole}: HomePageProps) {
  const navigate = useNavigate();

  function logOut() {
    if (userToken) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("userinfo");
      setUserToken(null);
      setUserName("Guest");
      setRole("")
      navigate("/");
    } else {
      setShowLoginPopup(true);
    }
  }
  
  return (
    <>
  <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
    <Container fluid> {/* Use fluid container for full width */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <Navbar.Brand>Clinic-O</Navbar.Brand>
      </Link>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link onClick={() => logOut()}>
            {userToken ? "Logout" : "Login"}
          </Nav.Link>
          <Nav.Link href="link">Link</Nav.Link>
        </Nav>
        <Nav.Item>{userToken ? userRole : "Role"}</Nav.Item>
      </Navbar.Collapse>
    </Container>
  </Navbar>
</>
  );
}

export default HomePage;
