import type { Usuario } from "./usuarios";

export interface LoginResponse {
    token: string;
    usuario: Usuario;
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
    user: Usuario | null;
    token: string | null;
    isAuthenticated: boolean;
    // login: (usernameOrEmail: string, password: string) => Promise<boolean>;
    login: (userData: Usuario, token: string, refreshToken: string) => void;
    logout: () => void;
}