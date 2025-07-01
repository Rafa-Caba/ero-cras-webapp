
export interface ImagenGaleria {
    _id: string;
    titulo: string;
    descripcion: string;
    imagenUrl: string;
    destacada: boolean;
    createdAt?: string;
}

export interface ImagenResponse {
    mensaje: string;
    imagen: ImagenGaleria;
}

export interface ImagenesResponse {
    imagenes: ImagenGaleria[];
    totalPaginas: number;
    paginaActual: number;
}

export interface NuevaImagenForm {
    titulo: string;
    descripcion: string;
    imagen: File | null;
}