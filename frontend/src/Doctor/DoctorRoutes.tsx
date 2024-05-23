
import { Routes, Route } from "react-router-dom";
import DoctorHomePage from "./DoctorHomePage";
import { ProtectedRoute } from "../ProtectedRoute";
import PatientAppointment from "./PatientAppointment";

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
        path="/patient-appointment"
        element={
            <ProtectedRoute userRole={userRole} allowedRoles={['doctor']}>
                <PatientAppointment />
            </ProtectedRoute>
        }
        />
  </Routes>
);

export default DoctorRoutes;
