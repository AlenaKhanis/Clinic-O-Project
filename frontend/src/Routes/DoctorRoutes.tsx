import { Routes, Route } from "react-router-dom";
import DoctorHomePage from "../DoctorComponents/DoctorHomePage";
import { ProtectedRoute } from "../ProtectedRoute";
import StartAppointment from "../DoctorComponents/PatientAppointment";
import PatientProfile from "../Admin/PatientNewProfile";
import DoctorProfile from "../Admin/DoctorProfile";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const DoctorRoutes = ({ userRole }: { userRole: string }) => (

  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['doctor']}>
          <DoctorHomePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/start_appointment/:patient_id/:appointment_id"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['doctor']}>
          <StartAppointment />
        </ProtectedRoute>
      }
    />
    <Route
      path="/patient_detail/:patient_id"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['doctor']}>
          <PatientProfile 
          isOwner={false} 
          
           />
        </ProtectedRoute>
      }
    />
    <Route
      path="/doctor_profile/:doctorId"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['doctor']}>
          <DoctorProfile
            isOwner={false}
          />
        </ProtectedRoute>
      }
      />
  </Routes>
);

export default DoctorRoutes;
