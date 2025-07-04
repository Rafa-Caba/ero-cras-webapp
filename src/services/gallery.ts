import api from "../api/axios";
import type { ImagenesResponse, ImagenGaleria, ImagenResponse } from "../types";

// Obtener imágenes con paginación
export const obtenerImagenes = async (pagina = 1) => {
    const res = await api.get<ImagenesResponse>(`/uploads?page=${pagina}`);
    return res.data; // { imagenes, paginaActual, totalPaginas }
};

// Obtener imagen por ID
export const obtenerImagenPorId = async (id: string) => {
    const res = await api.get<ImagenGaleria>(`/uploads/${id}`);
    return res.data;
};

// Crear nueva imagen
export const crearImagen = async (formData: FormData) => {
    const res = await api.post<ImagenResponse>('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// Actualizar imagen existente
export const actualizarImagen = async (id: string, formData: FormData) => {
    const res = await api.put<ImagenResponse>(`/uploads/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
};

// Marcar imagen para un campo especial (logo, leftMenu, etc.)
export const marcarCampoImagen = async (
    id: string,
    campo: 'imagenInicio' | 'imagenLeftMenu' | 'imagenRightMenu' | 'imagenNosotros' | 'imagenLogo' | 'imagenGaleria'
) => {
    const res = await api.patch<ImagenResponse>(`/uploads/marcar/${campo}/${id.trim()}`);
    return res.data;
};

export const marcarCampoGaleria = async (id: string, valor: boolean) => {
    const res = await api.patch<ImagenResponse>(
        `/uploads/marcar/imagenGaleria/${id}`,
        { valor },
        { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data;
};

// Eliminar imagen
export const eliminarImagen = async (id: string) => {
    const res = await api.delete<{ mensaje: string }>(`/uploads/${id}`);
    return res.data;
};