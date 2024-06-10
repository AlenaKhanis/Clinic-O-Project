import { useState } from "react";
import { Routes, Route, BrowserRouter, Navigate, useLocation } from "react-router-dom";
import BlogSection from "./HomePage/BlogSection";
import LoginForm from "./HomePage/LoginForm";
import Register from './HomePage/RegisterForm';
import Footer from "./HomePage/Footer";
import HomeNavBar from "./HomePage/Navbar";
import MainBody from "./HomePage/MainBody";
import NotFoundPage from "./NotFoundPage";
import PatientRoutes from "./Routes/PatientRoutes";
import DoctorRoutes from "./Routes/DoctorRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import "./css/App.css";

// import BlogSection from "./HomePage/BlogSection";
// const LoginForm = lazy(() => import('./HomePage/LoginForm'));
// const Register = lazy(() => import('./HomePage/RegisterForm'));
// const Footer = lazy(() => import('./HomePage/Footer'));
// const DoctorRoutes = lazy(() => import('./Routes/DoctorRoutes'));
// const PatientRoutes = lazy(() => import('./Routes/PatientRoutes'));
// const NotFoundPage = lazy(() => import('./NotFoundPage'));
// const HomeNavBar = lazy(() => import('./HomePage/Navbar'));
// const MainBody = lazy(() => import("./HomePage/MainBody"));
// const AdminRoutes = lazy(() => import("./Routes/AdminRoutes"));

function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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

  const [userToken, setUserToken] = useState<string | null>(() => {
    const token = localStorage.getItem('access_token');
    return token;
  });

  const [userName, setUserName] = useState<string>(() => {
    const usernameInfo = localStorage.getItem('userinfo');

    if (usernameInfo !== null) {
      const userinfo = JSON.parse(usernameInfo);
      return userinfo.full_name;
    }
    return "Guest";
  });

  const [userRole, setRole] = useState<string>(() => {
    const userinfo = localStorage.getItem('userinfo');
    if (userinfo) {
      const { role } = JSON.parse(userinfo);
      return role;
    } else {
      return "";
    }
  });

  const [userId, ] = useState<number>(() => {
    const userinfo = localStorage.getItem('userinfo');
    if (userinfo) {
      const { id } = JSON.parse(userinfo);
      return id;
    } else {
      return 0;
    }
  });

  return (
    <BrowserRouter>
      <Cover>
        <HomeNavBar setShowLoginPopup={setShowLoginPopup} setUserName={setUserName} setUserToken={setUserToken} userToken={userToken} setRole={setRole} userName={userName} role={userRole} />
        <Routes>
          <Route path="/patient/*" element={<PatientRoutes userRole={userRole} />} />
          <Route path="/doctor/*" element={<DoctorRoutes userRole={userRole} />} />
          <Route path="/admin/*" element={<AdminRoutes userRole={userRole} userId={userId} />} />
          

          <Route
            path="/"
            element={
              <div className="homepage-container">
                <div className="mainbody">
                  <MainBody userRole={userRole} userToken={userToken} setShowLoginPopup={setShowLoginPopup} setUserName={setUserName} setUserToken={setUserToken} setRole={setRole} userName={userName} />
                </div>
                
                  <BlogSection />
                
              </div>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<NotFoundPage userRole={userRole} />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
        {showLoginPopup && <LoginForm show={showLoginPopup} setShow={setShowLoginPopup} setUserToken={setUserToken} setUserName={setUserName} setRole={setRole} />}
        
      </Cover>
    </BrowserRouter>
  );
}

export default App;
