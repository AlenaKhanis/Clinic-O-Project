import { Routes, Route } from "react-router-dom";
import DoctorHomePage from "../DoctorComponents/DoctorHomePage";
import { ProtectedRoute } from "../ProtectedRoute";
import StartAppointment from "../DoctorComponents/PatientAppointment";
import PatientDetail from "../PatientDetails";
import HistoryAppointments from "../HistoryPatientAppointments";

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
        <ProtectedRoute userRole={userRole} allowedRoles={['doctor' , 'owner']}>
          <PatientDetail />
          <HistoryAppointments />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default DoctorRoutes;
