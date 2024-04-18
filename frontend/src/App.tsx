import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter as Router, Navigate } from "react-router-dom";
import BlogSection from "./HomePage/BlogSection";
import LoginForm from "./HomePage/LoginForm";
import Register from "./HomePage/RegisterForm";
import Footer from "./HomePage/Footer";
import HomePagePatient from "./Patient/PatientHomePage";
import DoctorHomePage from "./Doctor/DoctorHomePage";
import AdminPagePatient from "./Admin/AdminHomePage";
import HomePage from "./HomePage/HomePage";
import { MainBody } from "./HomePage/MainBody";


function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisternPopup, setShowRegisterPopup] = useState(false);
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
        <HomePage setShowLoginPopup={setShowLoginPopup} setUserName={setUserName} setUserToken={setUserToken} userRole={userRole} userToken={userToken} setRole={setRole} />
        <Routes>
          <Route path="/patient" element={userRole === "patient" ? <HomePagePatient /> : <Navigate to="/404" />} />
          <Route path="/doctor" element={userRole === "doctor" ? <DoctorHomePage /> : <Navigate to="/404" />} />
          <Route path="/admin" element={userRole === "owner" ? <AdminPagePatient /> : <Navigate to="/404" />} />
          <Route
            path="/"
            element={
              <div>
                <MainBody userRole={userRole} setShowRegisterPopup={setShowRegisterPopup} userName={userName} />
                <BlogSection />
                <Footer />
              </div>
            }
          />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
        {showLoginPopup && <LoginForm setShowLoginPopup={setShowLoginPopup} setUserToken={setUserToken} setUserName={setUserName} setRole={setRole} />}
        {showRegisternPopup && <Register setShowRegisterPopup={setShowRegisterPopup} />}
      </>
    </Router>
  );
}

export default App;

