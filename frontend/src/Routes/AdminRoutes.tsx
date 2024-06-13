
import { Routes, Route } from 'react-router-dom';
import AdminPage from '../Admin/AdminHomePage';
import { ProtectedRoute } from '../ProtectedRoute';
import DoctorProfile from '../Admin/DoctorProfile';
import PatientProfile from '../Admin/PatientNewProfile';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const AdminRoutes = ({ userRole }: { userRole: string, userId: number }) => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
          <AdminPage />
        </ProtectedRoute>
      }
    />
    <Route
      path='doctor-profile/:doctorId'
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
          <DoctorProfile/>
        </ProtectedRoute>
      }
      />
      <Route
        path='/patient_detail/:patient_id'
        element={
          <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
            <PatientProfile
             isOwner={true}
             BACKEND_URL={BACKEND_URL} />
          </ProtectedRoute>
        }
      />
  </Routes>
);

export default AdminRoutes;
