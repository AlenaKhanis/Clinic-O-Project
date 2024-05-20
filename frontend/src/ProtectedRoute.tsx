
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ role, userRole, children }: { role: string, userRole: string, children: React.ReactNode }) => {
        if (userRole === role) {
            return children;
        } else {
            return <Navigate to="/404" />;
        }
    } 
