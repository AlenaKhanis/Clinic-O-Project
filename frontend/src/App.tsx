import { useEffect, useState } from 'react';

import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import BlogSection from './HomePage/BlogSection';
import LoginForm from './HomePage/LoginForm';
import Register from './HomePage/RegisterForm';
import Footer from './HomePage/Footer';
import HomeNavBar from './HomePage/Navbar';
import NotFoundPage from './NotFoundPage';
import PatientRoutes from './Routes/PatientRoutes';
import DoctorRoutes from './Routes/DoctorRoutes';
import AdminRoutes from './Routes/AdminRoutes';
import About from './About';



import './css/App.css';
import {jwtDecode} from 'jwt-decode';
import { BackendUrlProvider } from './BackendUrlContext';
import ErrorBoundary from './ErrorBoundary';


/*App component sets up the main structure of your React application
 incorporating routing, user authentication, and various routes for different user roles. 
*/


function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem('access_token'));

  const [userRole, setUserRole] = useState<string>(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return decoded.role;
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
    return '';
  });

  //Watches changes in userToken to decode the JWT token and update userRole
  useEffect(() => {
    if (userToken) {
      try {
        const decoded: any = jwtDecode(userToken);
        setUserRole(decoded.role);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    }
  }, [userToken]);



  const [userName, setUserName] = useState<string>(() => {
    const usernameInfo = localStorage.getItem('userinfo');
    if (usernameInfo !== null) {
      const userinfo = JSON.parse(usernameInfo);
      return userinfo.full_name;
    }
    return 'Guest';
  });

  const getSubFromToken = (token: string) => {
    try {
      const decodedToken: { sub: string } = jwtDecode(token);
      return decodedToken.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }

  const subId = userToken ? getSubFromToken(userToken) : null;

  return (
    <BackendUrlProvider>
      <BrowserRouter>
      <ErrorBoundary>
          <HomeNavBar setShowLoginPopup={setShowLoginPopup} setUserName={setUserName} setUserToken={setUserToken} userToken={userToken} userName={userName} role={userRole} setRole={setUserRole} subId={subId}  />
          <Routes>
            <Route path="/patient/*" element={<PatientRoutes userRole={userRole} />} />
            <Route path="/doctor/*" element={<DoctorRoutes userRole={userRole} />} />
            <Route path="/admin/*" element={<AdminRoutes userRole={userRole} subID={subId} />} />
            <Route
              path="/"
              element={
                <div className='main-div'>
                  <h1 className='welcome'>Welcome to Clinic-O</h1>
                  <p className='welcome-text'>Your one-stop solution for all your medical needs</p>
                  <BlogSection />
                  <Footer />
                </div>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/404" element={<NotFoundPage userRole={userRole} />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
          {showLoginPopup && <LoginForm show={showLoginPopup} setShow={setShowLoginPopup} setUserToken={setUserToken} setUserName={setUserName} />}
        </ErrorBoundary>
      </BrowserRouter>
    </BackendUrlProvider>
  );
}

export default App;
