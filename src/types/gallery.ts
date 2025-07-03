
export interface ImagenGaleria {
    _id: string;
    titulo: string;
    descripcion: string;
    imagenUrl: string;
    imagenInicio: string;
    imagenLeftMenu: string;
    imagenRightMenu: string;
    imagenNosotros: string;
    imagenLogo: string;
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

export interface GaleriaState {
    imagenes: ImagenGaleria[];
    imagenSeleccionada: ImagenGaleria | null;
    paginaActual: number;
    totalPaginas: number;
    cargando: boolean;
    error: string | null;

    // Acciones
    fetchImagenes: (pagina?: number) => Promise<void>;
    fetchImagenPorId: (id: string) => Promise<void>;
    crearNuevaImagen: (formData: FormData) => Promise<void>;
    actualizarImagenExistente: (id: string, formData: FormData) => Promise<void>;
    marcarCampo: (
        id: string,
        campo: 'imagenInicio' | 'imagenLeftMenu' | 'imagenRightMenu' | 'imagenNosotros' | 'imagenLogo'
    ) => Promise<ImagenResponse>;
    eliminarImagenPorId: (id: string) => Promise<void>;
}