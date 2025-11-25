import type { User } from "./usuarios";

export interface LoginResponse {
    token: string;
    user: User;
    role: 'ADMIN' | 'EDITOR' | 'USER' // Types of users for this choir app.
}

export interface LoginForm {
    usernameOrEmail: string;
    password: string;
}

export interface AuthUsuario {
    _id: string;

    nombre: string;
    username: string;
    correo: string;
    password: string;
    password2?: string;
    rol: 'admin' | 'editor' | 'viewer';
    fotoPerfil: File | null;
    fotoPerfilUrl?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;

    // Functions
    login: (userData: User, token: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (updatedUser: User) => void;
}