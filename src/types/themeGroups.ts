export interface Theme {
    _id?: string;
    nombre: string;        // Ej: "Color Primario"
    colorClass: string;    // Ej: "primary"
    color: string;         // Ej: "#ead4ff"
}

export interface ThemeGroup {
    _id?: string;
    nombre: string;
    colores: Theme[];
    creadoPor?: string;
    actualizadoPor?: string;
    activo: boolean;
    esTemaPublico?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ThemeGroupForm {
    nombre: string;
    colores: {
        nombre: string;
        colorClass: string;
        color: string;
    }[];
}

export interface GruposPublicosResponse {
    grupos: ThemeGroup[];
}

export interface ThemeGroupsState {
    grupos: ThemeGroup[];
    grupoSeleccionado: ThemeGroup | null;
    cargando: boolean;
    error: string | null;
    paginaActual: number;
    totalPaginas: number;
    totalGrupos: number;
    temaActivo: ThemeGroup | null;

    fetchGrupos: (pagina?: number) => Promise<void>;
    fetchGrupoPorId: (id: string) => Promise<ThemeGroup>;
    createNuevoGrupo: (data: ThemeGroupForm) => Promise<void>;
    actualizarGrupoExistente: (id: string, data: ThemeGroupForm) => Promise<ThemeGroup | undefined>;
    eliminarGrupoPorId: (id: string) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
    setTemaActivo: (grupo: ThemeGroup) => void;
    activarGrupo: (id: string) => Promise<void>;
    publicarGrupoComoPublico: (id: string) => Promise<void>;
    fetchTemaActivo: () => Promise<void>;
}

export interface PublicThemeGroupsState {
    themeGroups: ThemeGroup[];
    temaActivo: ThemeGroup | null;
    cargando: boolean;
    error: string | null;
    fetchThemeGroupsPublicos: () => Promise<void>;
    fetchTemaActivoPublico: () => Promise<void>
    setTemaActivo: (grupo: ThemeGroup) => void;
}