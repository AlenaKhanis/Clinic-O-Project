
import { Routes, Route } from "react-router-dom";
import HomePagePatient from "../Patient/PatientHomePage";
import { ProtectedRoute } from "../ProtectedRoute";
import PatientProfile from "../Admin/PatientNewProfile";


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
    <Route
      path="/patient_profile/:patient_id"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['patient']}>
          <PatientProfile 
          isOwner={false}
          />
        </ProtectedRoute>
      }
      />
  </Routes>
);

export default PatientRoutes;
