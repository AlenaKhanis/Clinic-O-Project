import { Routes, Route } from "react-router-dom";
import DoctorHomePage from "../DoctorComponents/DoctorHomePage";
import { ProtectedRoute } from "../ProtectedRoute";
import StartAppointment from "../DoctorComponents/StartAppt";
import PatientProfile from "../Admin/PatientNewProfile";
import DoctorProfile from "../Admin/DoctorProfile";

/**
 * DoctorRoutes component
 * Defines the routes available to a doctor user.
 */

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
          userRole={userRole}
          
          
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
