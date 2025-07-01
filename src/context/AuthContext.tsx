import { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { AuthContextType, Usuario } from '../types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const navigate = useNavigate();

    const isAuthenticated = !!token;

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const login = (userData: Usuario, accessToken: string, refreshToken: string) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));

        navigate('/admin');
    };

    const logout = () => {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            api.post('/login/logout', { token: refreshToken });
        }

        setUser(null);
        setToken(null);
        localStorage.clear();
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};