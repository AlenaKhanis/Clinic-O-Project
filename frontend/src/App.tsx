import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import BlogSection from "./HomePage/BlogSection";
import LoginForm from "./HomePage/LoginForm";
import Register from "./HomePage/RegisterForm";
import Footer from "./HomePage/Footer";
import HomePagePatient from "./Patient/PatientHomePage";
import DoctorHomePage from "./Doctor/DoctorHomePage";
import AdminPagePatient from "./Admin/AdminHomePage";
import MainPage, { MainBody } from "./HomePage/HomePage";

function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showRegisternPopup, setShowRegisterPopup] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [roleUser, setRoleUser] = useState<string>(() => {
    const userinfoString = localStorage.getItem('userinfo');
  
    if (userinfoString !== null) {
      const userinfo = JSON.parse(userinfoString);
      const role = userinfo.role;
      return role || "Guest"; 
    }
    return "Guest"; 
  });

  // Check authentication status upon page load
  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = !!localStorage.getItem('userToken');
    if (isAuthenticated) {
      // If authenticated, set the user token
      setUserToken(localStorage.getItem('userToken'));
    }
  }, []);

  const NotFoundPage = () => {
    return (
      <div>
        <h1>404 - Not Found</h1>
        <p>Sorry, the page you are looking for does not exist.</p>
      </div>
    );
  };

  return (
    <Router>
      <>
        <MainPage setShowLoginPopup={setShowLoginPopup} setShowLogo={setShowLogo} showLogo={showLogo} setUserName={setRoleUser} setUserToken={setUserToken} />
        <Routes>
          <Route path="/patient" element={roleUser === "patient" ? <HomePagePatient /> : <Navigate to="/404" />} />
          <Route path="/doctor" element={roleUser === "doctor" ? <DoctorHomePage /> : <Navigate to="/404" />} />
          <Route path="/admin" element={roleUser === "owner" ? <AdminPagePatient /> : <Navigate to="/404" />} />
          <Route
            path="/"
            element={
              <div>
                <MainBody userRole={roleUser} setShowRegisterPopup={setShowRegisterPopup} />
                <BlogSection />
                <Footer />
              </div>
            }
          />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
        {showLoginPopup && <LoginForm setShowLoginPopup={setShowLoginPopup} setUserToken={setUserToken} setUserName={setRoleUser}  setShowLogo={setShowLogo}/>}
        {showRegisternPopup && <Register setShowRegisterPopup={setShowRegisterPopup} />}
      </>
    </Router>
  );
}

export default App;
