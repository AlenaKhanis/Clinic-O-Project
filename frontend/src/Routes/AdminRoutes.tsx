
import { Routes, Route } from 'react-router-dom';
import AdminPage from '../Admin/AdminHomePage';
import { ProtectedRoute } from '../ProtectedRoute';


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
  </Routes>
);

export default AdminRoutes;
