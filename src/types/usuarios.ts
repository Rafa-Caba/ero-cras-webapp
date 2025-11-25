import type { ThemeGroup } from "./themeGroups";

export interface User {
    _id: string;
    nombre: string;
    username: string;
    correo: string;
    fotoPerfilUrl?: string;
    rol: 'admin' | 'editor' | 'viewer';
    ultimoAcceso: string;
    themePersonal?: ThemeGroup | null;
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
    usuarios: User[];
    paginaActual: number;
    totalPaginas: number;
    totalUsuarios: number;
}

export interface DeleteResponse {
    mensaje: string;
}

export interface UpdateResponse {
    mensaje: string;
    usuarioActualizado: User;
}

export interface UsuariosState {
    usuarios: User[];
    usuarioSeleccionado: User | null;
    cargando: boolean;
    error: string | null;
    paginaActual: number;
    totalPaginas: number;
    totalUsuarios: number;

    // Acciones
    fetchUsuarios: (pagina?: number, limite?: number) => Promise<void>;
    fetchUsuarioPorId: (id: string) => Promise<User>;
    crearNuevoUsuario: (formData: FormData) => Promise<void>;
    actualizarUsuarioExistente: (id: string, formData: FormData) => Promise<void>;
    actualizarUsuarioLogueado: (id: string, data: any) => Promise<User>;
    actualizarTemaPersonal: (id: string, themeId: string) => Promise<User>;
    eliminarUsuarioPorId: (id: string) => Promise<void>;
    buscarUsuariosPorTexto: (q: string) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
}