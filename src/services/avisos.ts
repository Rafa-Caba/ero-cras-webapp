import api from '../api/axios';
import type { Aviso, AvisosResponse, DeleteResponse, UpdateResponse } from '../types';

// Obtener avisos paginados
export const obtenerAvisos = async (pagina = 1, limit = 5): Promise<AvisosResponse> => {
    const res = await api.get<AvisosResponse>(`/avisos?page=${pagina}&limit=${limit}`);
    return res.data;
};

// Obtener aviso por ID
export const obtenerAvisoPorId = async (id: string): Promise<Aviso> => {
    const res = await api.get<Aviso>(`/avisos/${id}`);
    return res.data;
};

// Crear aviso (con imagen)
export const crearAviso = async (formData: FormData): Promise<UpdateResponse> => {
    const res = await api.post<UpdateResponse>('/avisos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// Actualizar aviso (con imagen)
export const actualizarAviso = async (id: string, formData: FormData): Promise<UpdateResponse> => {
    const res = await api.put<UpdateResponse>(`/avisos/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// Eliminar aviso
export const eliminarAviso = async (id: string): Promise<DeleteResponse> => {
    const res = await api.delete<DeleteResponse>(`/avisos/${id}`);
    return res.data;
};

// Buscar avisos por título
export const buscarAvisos = async (q: string): Promise<Aviso[]> => {
    const res = await api.get<Aviso[]>(`/avisos/buscar?q=${encodeURIComponent(q)}`);
    return res.data;
};
