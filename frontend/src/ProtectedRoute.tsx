import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
    userRole: string;
    allowedRoles: string[];
    children: React.ReactNode;
};


/*
The ProtectedRoute component is checks if the user's role matches any of the allowed roles specified for the route.
If the user has the appropriate role, the component renders the children components
otherwise, it redirects the user to a "404 Not Found" page.
*/

export const ProtectedRoute = ({  userRole, allowedRoles, children }: ProtectedRouteProps) => {
    if (allowedRoles.includes(userRole)) {
        return <>{children}</>;
    } else {
        return <Navigate to="/404" />;
    }
};