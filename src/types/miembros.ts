export interface Miembro {
    _id: string;
    nombre: string;
    instrumento: string;
    tieneVoz: boolean;
    fotoPerfilUrl?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MiembroForm {
    nombre: string;
    instrumento: string;
    tieneVoz: boolean;
    fotoPerfil: File | null;
    fotoPerfilUrl?: string;
}

export interface MiembrosResponse {
    miembros: Miembro[];
    paginaActual: number;
    totalPaginas: number;
    totalMiembros: number;
}

export interface MiembroDeleteResponse {
    mensaje: string;
}

export interface MiembroUpdateResponse {
    mensaje: string;
}
