import api, { publicApi } from "../api/axios";
import type { Theme } from "../types/themes";

export const eliminarColorClass = async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
};

export const obtenerTema = async (page?: number, limit?: number): Promise<{ temas: Theme[]; paginaActual?: number; totalPaginas?: number }> => {
    const queryParams = page && limit
        ? `?page=${page}&limit=${limit}`
        : `?all=true`;

    const res = await api.get(`/themes${queryParams}`);
    return res.data;
};

export const obtenerTodosLosTemas = async (): Promise<{ temas: Theme[]; totalTemas: number }> => {
    const res = await api.get<{ temas: Theme[]; totalTemas: number }>('/themes?all=true');
    return res.data;
};

export const crearColorClass = async (nuevo: Theme): Promise<Theme> => {
    const res = await api.post<Theme>('/themes/new', nuevo);
    return res.data;
};

export const obtenerTemaPorId = async (id: string): Promise<Theme> => {
    const res = await api.get(`/themes/${id}`);
    return res.data;
};

export const actualizarColorClass = async (id: string, updated: Theme): Promise<Theme> => {
    const res = await api.put(`/themes/${id}`, updated);
    return res.data;
};

// Obtener temas públicamente
export const obtenerTemasPublicos = async (): Promise<Theme[]> => {
    const res = await publicApi.get<{ temas: Theme[] }>('/themes/public');
    return res.data.temas;
};