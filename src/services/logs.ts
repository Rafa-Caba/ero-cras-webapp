import api from '../api/axios';
import type { Log, LogsResponse, UsuarioLogsResponse } from '../types/logs';

// Obtener logs con paginación y filtros
export const obtenerLogs = async (
    pagina = 1,
    filtro: Record<string, string> = {}
): Promise<LogsResponse> => {
    const params = new URLSearchParams({ page: pagina.toString(), ...filtro });
    const res = await api.get<LogsResponse>(`/logs?${params.toString()}`);
    return res.data;
};

// Buscar logs por texto (por ejemplo, título o ID)
export const buscarLogs = async (query: string): Promise<Log[]> => {
    const res = await api.get<Log[]>(`/logs/buscar?q=${encodeURIComponent(query)}`);
    return res.data;
};

// Obtener logs por usuario
export const obtenerLogsPorUsuario = async (usuarioId: string, pagina = 1) => {
    const res = await api.get<UsuarioLogsResponse>(`/logs/usuario/${usuarioId}?page=${pagina}`);
    return res.data;
}