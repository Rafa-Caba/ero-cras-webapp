export interface ThemeOld {
    _id?: string;
    nombre: string;
    color: string;
    colorClass: string;
}

export interface ThemeState {
    themes: ThemeOld[];
    loading: boolean;
    getThemes: (pagina?: number) => Promise<void>;  // Ahora acepta número de página opcional
    getAllThemes: () => Promise<void>;
    createColorClass: (nuevo: ThemeOld) => Promise<void>;
    deleteColorClass: (id: string) => Promise<void>;
    updateColorClass: (id: string, updated: ThemeOld) => Promise<void>;
    getColorClassById: (id: string) => Promise<ThemeOld | null>;
    paginaActual: number;
    totalPaginas: number;
    setPaginaActual: (pagina: number) => void;
}