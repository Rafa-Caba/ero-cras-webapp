import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/admin/login" />;
};
