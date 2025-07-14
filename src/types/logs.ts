export interface Log {
    _id: string;
    usuario: {
        _id: string;
        nombre: string;
        username: string;
    };
    coleccion: string;
    accion: 'crear' | 'actualizar' | 'eliminar';
    referenciaId: string;
    cambios?: {
        antes?: any;
        despues?: any;
    };
    createdAt: string;
}

export interface LogsResponse {
    logs: Log[];
    paginaActual: number;
    totalPaginas: number;
    totalLogs: number;
}

export interface UsuarioLogsResponse {
    logs: Log[];
    paginaActual: number;
    totalPaginas: number;
}
