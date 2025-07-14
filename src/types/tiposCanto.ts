export interface TipoCanto {
    _id: string;
    nombre: string;
    orden: number;
    creadoPor?: string;
    actualizadoPor?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface FormTipoCanto {
    nombre: string;
    orden: number;
}

export interface TipoCantoState {
    tipos: TipoCanto[];
    loading: boolean;
    paginaActual: number;
    totalPaginas: number;

    getTipos: (pagina?: number, limit?: number) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
    createTipo: (nuevo: FormTipoCanto) => Promise<void>;
    updateTipo: (id: string, data: FormTipoCanto) => Promise<void>;
    deleteTipo: (id: string) => Promise<void>;
    getTipoPorId: (id: string) => Promise<TipoCanto | null>;
}