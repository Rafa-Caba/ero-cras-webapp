import api, { publicApi } from "../api/axios";
import type { ThemeOld } from "../types/themes";

export const eliminarColorClass = async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
};

export const obtenerTema = async (page?: number, limit?: number): Promise<{ temas: ThemeOld[]; paginaActual?: number; totalPaginas?: number }> => {
    const queryParams = page && limit
        ? `?page=${page}&limit=${limit}`
        : `?all=true`;

    const res = await api.get(`/themes${queryParams}`);
    return res.data;
};

export const obtenerTodosLosTemas = async (): Promise<{ temas: ThemeOld[]; totalTemas: number }> => {
    const res = await api.get<{ temas: ThemeOld[]; totalTemas: number }>('/themes?all=true');
    return res.data;
};

export const crearColorClass = async (nuevo: ThemeOld): Promise<ThemeOld> => {
    const res = await api.post<ThemeOld>('/themes/new', nuevo);
    return res.data;
};

export const obtenerTemaPorId = async (id: string): Promise<ThemeOld> => {
    const res = await api.get(`/themes/${id}`);
    return res.data;
};

export const actualizarColorClass = async (id: string, updated: ThemeOld): Promise<ThemeOld> => {
    const res = await api.put(`/themes/${id}`, updated);
    return res.data;
};

// Obtener temas públicamente
export const obtenerTemasPublicos = async (): Promise<ThemeOld[]> => {
    const res = await publicApi.get<{ temas: ThemeOld[] }>('/themes/public');
    return res.data.temas;
};