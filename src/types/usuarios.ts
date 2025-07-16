import type { ThemeGroup } from "./themeGroups";

export interface Usuario {
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
    usuarioActualizado: Usuario;
}

export interface UsuariosState {
    usuarios: Usuario[];
    usuarioSeleccionado: Usuario | null;
    cargando: boolean;
    error: string | null;
    paginaActual: number;
    totalPaginas: number;
    totalUsuarios: number;

    // Acciones
    fetchUsuarios: (pagina?: number, limite?: number) => Promise<void>;
    fetchUsuarioPorId: (id: string) => Promise<Usuario>;
    crearNuevoUsuario: (formData: FormData) => Promise<void>;
    actualizarUsuarioExistente: (id: string, formData: FormData) => Promise<void>;
    actualizarUsuarioLogueado: (id: string, data: any) => Promise<Usuario>;
    actualizarTemaPersonal: (id: string, themeId: string) => Promise<Usuario>;
    eliminarUsuarioPorId: (id: string) => Promise<void>;
    buscarUsuariosPorTexto: (q: string) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
}