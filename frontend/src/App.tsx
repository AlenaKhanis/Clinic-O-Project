import { useEffect, useState, Suspense, lazy } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';

import Footer from './HomePage/Footer';
import HomeNavBar from './HomePage/Navbar';
import NotFoundPage from './NotFoundPage';
import { jwtDecode } from 'jwt-decode';
import { BackendUrlProvider } from './BackendUrlContext';
import ErrorBoundary from './ErrorBoundary';
import './css/App.css';

// Lazy load components
const BlogSection = lazy(() => import('./HomePage/BlogSection'));
const LoginForm = lazy(() => import('./HomePage/LoginForm'));
const Register = lazy(() => import('./HomePage/RegisterForm'));
const PatientRoutes = lazy(() => import('./Routes/PatientRoutes'));
const DoctorRoutes = lazy(() => import('./Routes/DoctorRoutes'));
const AdminRoutes = lazy(() => import('./Routes/AdminRoutes'));
const About = lazy(() => import('./About'));

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
          <HomeNavBar setShowLoginPopup={setShowLoginPopup} setUserName={setUserName} setUserToken={setUserToken} userToken={userToken} userName={userName} role={userRole} setRole={setUserRole} subId={subId} />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/patient/*" element={<PatientRoutes userRole={userRole} />} />
              <Route path="/doctor/*" element={<DoctorRoutes userRole={userRole} />} />
              <Route path="/admin/*" element={<AdminRoutes userRole={userRole} subID={subId} />} />
              <Route
                path="/"
                element={
                  <div className='main-div'>
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
          </Suspense>
          {showLoginPopup && <LoginForm show={showLoginPopup} setShow={setShowLoginPopup} setUserToken={setUserToken} setUserName={setUserName} />}
        </ErrorBoundary>
      </BrowserRouter>
    </BackendUrlProvider>
  );
}

export default App;
