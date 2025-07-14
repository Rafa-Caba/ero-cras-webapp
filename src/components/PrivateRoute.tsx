import type { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // console.log({ user, loading });

    if (loading) return <div>cargando...</div>;

    if (!user) {
        return <Navigate to="/admin/login" replace state={{ from: location }} />;
    }

    return children;
};
