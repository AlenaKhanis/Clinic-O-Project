import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
    userRole: string;
    allowedRoles: string[];
    children: React.ReactNode;
};

export const ProtectedRoute = ({  userRole, allowedRoles, children }: ProtectedRouteProps) => {
    if (allowedRoles.includes(userRole)) {
        return <>{children}</>;
    } else {
        return <Navigate to="/404" />;
    }
};