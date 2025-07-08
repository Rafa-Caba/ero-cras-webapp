import api, { publicApi } from '../api/axios';
import type { MiembrosResponse, DeleteResponse, UpdateResponse, Miembro, MiembroDeleteResponse, MiembroUpdateResponse } from '../types';

export const obtenerMiembros = async (pagina = 1, limit = 5): Promise<MiembrosResponse> => {
    const res = await api.get<MiembrosResponse>(`/miembros?page=${pagina}&limit=${limit}`);
    return res.data;
};

export const obtenerMiembroPorId = async (id: string): Promise<Miembro> => {
    const res = await api.get<Miembro>(`/miembros/${id}`);
    return res.data;
};

export const eliminarMiembro = async (id: string): Promise<MiembroDeleteResponse> => {
    const res = await api.delete<DeleteResponse>(`/miembros/${id}`);
    return res.data;
};

export const actualizarMiembro = async (id: string, formData: FormData): Promise<MiembroUpdateResponse> => {
    const res = await api.put<UpdateResponse>(`/miembros/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const crearMiembro = async (formData: FormData): Promise<MiembroUpdateResponse> => {
    const res = await api.post<UpdateResponse>('/miembros', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const buscarMiembros = async (q: string): Promise<Miembro[]> => {
    const res = await api.get<Miembro[]>(`/miembros/buscar?q=${encodeURIComponent(q)}`);
    return res.data;
};

export const obtenerMiembrosPublicos = async (): Promise<Miembro[]> => {
    const res = await publicApi.get<Miembro[]>('/miembros/publicos');
    return res.data;
};