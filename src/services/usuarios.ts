import api from "../api/axios";
import type { Usuario, UsuariosResponse } from "../types";

export interface DeleteResponse {
    mensaje: string;
}

export interface UpdateResponse {
    mensaje: string;
}

export const obtenerUsuarios = async (pagina = 1, limit = 5): Promise<UsuariosResponse> => {
    const res = await api.get<UsuariosResponse>(`/usuarios?page=${pagina}&limit=${limit}`);
    return res.data;
};

export const obtenerUsuarioPorId = async (id: string): Promise<Usuario> => {
    const res = await api.get<Usuario>(`/usuarios/${id}`);
    return res.data;
};

export const eliminarUsuario = async (id: string): Promise<DeleteResponse> => {
    const res = await api.delete<DeleteResponse>(`/usuarios/${id}`);
    return res.data;
};

export const actualizarUsuario2 = async (id: string, formData: FormData): Promise<UpdateResponse> => {
    const res = await api.put<UpdateResponse>(`/usuarios/${id}`, formData);
    return res.data;
};
export const actualizarUsuario = async (id: string, formData: FormData): Promise<UpdateResponse> => {
    const res = await api.put<UpdateResponse>(`/usuarios/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const crearUsuario = async (formData: FormData): Promise<UpdateResponse> => {
    const res = await api.post<UpdateResponse>('/usuarios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const buscarUsuarios = async (q: string): Promise<Usuario[]> => {
    const res = await api.get<Usuario[]>(`/usuarios/buscar?q=${encodeURIComponent(q)}`);
    return res.data;
};