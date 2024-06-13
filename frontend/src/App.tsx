import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter, Navigate, useLocation } from 'react-router-dom';
import BlogSection from './HomePage/BlogSection';
import LoginForm from './HomePage/LoginForm';
import Register from './HomePage/RegisterForm';
import Footer from './HomePage/Footer';
import HomeNavBar from './HomePage/Navbar';
import MainBody from './HomePage/MainBody';
import NotFoundPage from './NotFoundPage';
import PatientRoutes from './Routes/PatientRoutes';
import DoctorRoutes from './Routes/DoctorRoutes';
import AdminRoutes from './Routes/AdminRoutes';
import './css/App.css';
import {jwtDecode} from 'jwt-decode';
import { BackendUrlProvider } from './BackendUrlContext';

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

  function Cover({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    return (
      <div className="main-container">
        <div className="content">
          {children}
        </div>
        {location.pathname === '/' && <Footer />}
      </div>
    );
  }

  const [userName, setUserName] = useState<string>(() => {
    const usernameInfo = localStorage.getItem('userinfo');
    if (usernameInfo !== null) {
      const userinfo = JSON.parse(usernameInfo);
      return userinfo.full_name;
    }
    return 'Guest';
  });

  const [userId] = useState<number>(() => {
    const userinfo = localStorage.getItem('userinfo');
    if (userinfo) {
      const { id } = JSON.parse(userinfo);
      return id;
    } else {
      return 0;
    }
  });

  return (
    <BackendUrlProvider>
      <BrowserRouter>
        <Cover>
          <HomeNavBar setShowLoginPopup={setShowLoginPopup} setUserName={setUserName} setUserToken={setUserToken} userToken={userToken} userName={userName} role={userRole} setRole={setUserRole} />
          <Routes>
            <Route path="/patient/*" element={<PatientRoutes userRole={userRole} />} />
            <Route path="/doctor/*" element={<DoctorRoutes userRole={userRole} />} />
            <Route path="/admin/*" element={<AdminRoutes userRole={userRole} userId={userId} />} />
            <Route
              path="/"
              element={
                <div className="homepage-container">
                  <div className="mainbody">
                    <MainBody userRole={userRole} userToken={userToken} setShowLoginPopup={setShowLoginPopup} setUserName={setUserName} setUserToken={setUserToken} userName={userName} setRole={setUserRole} />
                  </div>
                  <BlogSection />
                </div>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/404" element={<NotFoundPage userRole={userRole} />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
          {showLoginPopup && <LoginForm show={showLoginPopup} setShow={setShowLoginPopup} setUserToken={setUserToken} setUserName={setUserName} />}
        </Cover>
      </BrowserRouter>
    </BackendUrlProvider>
  );
}

export default App;
