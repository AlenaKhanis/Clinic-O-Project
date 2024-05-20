import { useState } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import BlogSection from "./HomePage/BlogSection";
import LoginForm from "./HomePage/LoginForm";
import Register from "./HomePage/RegisterForm";
import Footer from "./HomePage/Footer";
import HomePagePatient from "./Patient/PatientHomePage";
import DoctorHomePage from "./Doctor/DoctorHomePage";
import AdminPagePatient from "./Admin/AdminHomePage";
import HomePage from "./HomePage/HomePage";
import { MainBody } from "./HomePage/MainBody";
import PatientAppointment from "./Doctor/PatientAppointment";
import {ProtectedRoute} from "./ProtectedRoute";
import { NotFoundPage } from "./NotFoundPage";


function App() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);


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


  return (
    <BrowserRouter>
      <>
        <HomePage setShowLoginPopup={setShowLoginPopup} setUserName={setUserName} setUserToken={setUserToken} userToken={userToken} setRole={setRole}  userName={userName} />
        <Routes>
          <Route path="/patient" element={<ProtectedRoute role="patient" userRole={userRole}><HomePagePatient /></ProtectedRoute>} />
          <Route path="/doctor" element={<ProtectedRoute role="doctor" userRole={userRole}><DoctorHomePage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="owner" userRole={userRole}><AdminPagePatient /></ProtectedRoute>} />
          <Route path="/patient-appointment" element={<PatientAppointment />} />
          <Route
            path="/"
            element={
              <>
                <div className="mainbody">
                  <MainBody userRole={userRole} setShowRegisterPopup={setShowRegisterPopup} userName={userName} />
                  <BlogSection />
                  </div>
              </>
            }
          />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
        {showLoginPopup && <LoginForm setShowLoginPopup={setShowLoginPopup} setUserToken={setUserToken} setUserName={setUserName} setRole={setRole} />}
        {showRegisterPopup && <Register setShowRegisterPopup={setShowRegisterPopup} />}
        <Footer/>
      </>
    </BrowserRouter>
  );
}

export default App;

