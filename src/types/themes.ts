export interface Theme {
    _id?: string;
    nombre: string;
    color: string;
    colorClass: string;
}

export interface ThemeState {
    themes: Theme[];
    loading: boolean;
    getThemes: (pagina?: number) => Promise<void>;  // Ahora acepta número de página opcional
    getAllThemes: () => Promise<void>;
    createColorClass: (nuevo: Theme) => Promise<void>;
    deleteColorClass: (id: string) => Promise<void>;
    updateColorClass: (id: string, updated: Theme) => Promise<void>;
    getColorClassById: (id: string) => Promise<Theme | null>;
    paginaActual: number;
    totalPaginas: number;
    setPaginaActual: (pagina: number) => void;
}