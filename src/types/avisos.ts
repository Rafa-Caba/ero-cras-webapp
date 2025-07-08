export interface Aviso {
    _id: string;
    titulo: string;
    contenido: string;
    publicado: boolean;
    imagenUrl?: string;
    imagenPublicId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AvisosResponse {
    avisos: Aviso[];
    paginaActual: number;
    totalPaginas: number;
    totalAvisos: number;
}

export interface AvisoForm {
    titulo: string;
    contenido: string;
    publicado: boolean;
    imagen: File | null;
}