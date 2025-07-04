export interface Usuario {
    _id: string;
    nombre: string;
    username: string;
    correo: string;
    fotoPerfilUrl?: string;
    rol: 'admin' | 'editor' | 'viewer';
    createdAt?: string;
    updatedAt?: string;
}

export interface UsuarioForm {
    nombre: string;
    username: string;
    correo: string;
    password: string;
    password2?: string;
    rol: 'admin' | 'editor' | 'viewer';
    fotoPerfil: File | null;
    fotoPerfilUrl?: string;
}

export interface UsuariosResponse {
    usuarios: Usuario[];
    paginaActual: number;
    totalPaginas: number;
    totalUsuarios: number;
}

export interface DeleteResponse {
    mensaje: string;
}

export interface UpdateResponse {
    mensaje: string;
}