import api from "../api/axios";
import type { ImagenesResponse, ImagenGaleria, ImagenResponse } from "../types";

export const obtenerImagenes = async (pagina = 1) => {
    const res = await api.get<ImagenesResponse>(`/uploads?page=${pagina}`);
    return res.data; // { imagenes, paginaActual, totalPaginas }
};

export const obtenerImagenPorId = async (id: string) => {
    const res = await api.get<ImagenGaleria>(`/uploads/${id}`);
    return res.data;
};

export const crearImagen = async (formData: FormData) => {
    const res = await api.post<ImagenResponse>('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

export const actualizarImagen = async (id: string, formData: FormData) => {
    const res = await api.put<ImagenResponse>(`/uploads/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

export const destacarImagen = async (id: string) => {
    const res = await api.patch<ImagenResponse>(`/uploads/destacar/${id}`);
    return res.data;
};

export const eliminarImagen = async (id: string) => {
    const res = await api.delete<{ mensaje: string }>(`/uploads/${id}`);
    return res.data;
};