
import { Routes, Route } from 'react-router-dom';
import AdminPage from '../Admin/AdminHomePage';
import { ProtectedRoute } from '../ProtectedRoute';
import DoctorProfile from '../Admin/DoctorProfile';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const AdminRoutes = ({ userRole, userId }: { userRole: string, userId: number }) => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
          <AdminPage userId={userId} />
        </ProtectedRoute>
      }
    />
    <Route
      path='doctor-profile/:doctorId'
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
          <DoctorProfile
           BACKEND_URL={BACKEND_URL}  />
        </ProtectedRoute>
      }
      />
  </Routes>
);

export default AdminRoutes;
