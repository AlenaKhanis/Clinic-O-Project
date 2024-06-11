
import { Routes, Route } from "react-router-dom";
import HomePagePatient from "../Patient/PatientHomePage";
import { ProtectedRoute } from "../ProtectedRoute";

const PatientRoutes = ({ userRole }: { userRole: string }) => (

  
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['patient']}>
            <HomePagePatient />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default PatientRoutes;
