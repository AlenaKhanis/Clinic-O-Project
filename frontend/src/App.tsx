import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import BlogSection from "./HomePage/BlogSection";
import MainPage, { MainBody } from "./HomePage/HomePage";
import LoginForm from "./HomePage/LoginForm";
import Register from "./HomePage/RegisterForm";
import Footer from "./HomePage/Footer";
import UserProfile from "./UserType";
import HomePagePatient from "./Patient/PatientHomePage";
import DoctorHomePage from "./Doctor/DoctorHomePage";
import AdminPagePatient from "./Admin/AdminHomePage";

function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisternPopup, setShowRegisterPopup] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [nameUser, setUserName] = useState<string>(() => {
    const storedUserName = localStorage.getItem("user_role");
    return storedUserName ? JSON.parse(storedUserName) : "Guest";
  });

  
  const role = localStorage.getItem("user_role");
  

  return (
    <Router>
      <Routes>
    
        <Route path="/patient" element={role === '"patient"' ? <HomePagePatient /> : null} />
        <Route path="/doctor" element={role === "doctor" ? <DoctorHomePage /> : null} />
        <Route path="/admin" element={role === "owner" ? <AdminPagePatient /> : null} />
      </Routes>
      <MainPage setShowLoginPopup={setShowLoginPopup} />
      <div className="body-content" style={{ height: "calc(100vh - 56px)", overflow: "auto" }}>
        <MainBody userName={nameUser} setShowRegisterPopup={setShowRegisterPopup} />
      </div>
      <div className="blog-content" style={{ marginTop: "-250px" }}>
        <BlogSection />
      </div>
      {userToken ? (
        <UserProfile setUserToken={setUserToken} />
      ) : (
        showLoginPopup && <LoginForm setShowLoginPopup={setShowLoginPopup} setUserToken={setUserToken} setUserName={setUserName} />
      )}
      {showRegisternPopup && <Register setShowRegisterPopup={setShowRegisterPopup} />}
      <Footer />
    </Router>
  );
}

export default App;
