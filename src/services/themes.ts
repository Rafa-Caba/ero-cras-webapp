import api from "../api/axios";
import type { Theme } from "../types/themes";

export const eliminarColorClass = async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
};

export const obtenerTema = async (
    page = 1, limit = 6
): Promise<{ temas: Theme[]; paginaActual: number; totalPaginas: number }> => {
    const res = await api.get(`/themes?page=${page}&limit=${limit}`);
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