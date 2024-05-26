import { Routes, Route } from "react-router-dom";
import AdminPage from '../Admin/AdminHomePage';
import { ProtectedRoute } from "../ProtectedRoute";

const AdminRoutes = ({ userRole }: { userRole: string }) => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['admin']}>
            <AdminPage />
        </ProtectedRoute>
      }
    />
    {/* add more routes for the 'admin' role here... */}
  </Routes>
);

export default AdminRoutes;