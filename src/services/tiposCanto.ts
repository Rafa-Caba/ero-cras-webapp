import api, { publicApi } from "../api/axios";
import type { FormTipoCanto, TipoCanto } from "../types/tiposCanto";

// Obtener todos los tipos de canto (privado con paginación o todos)
export const obtenerTiposDeCanto = async (
    page?: number,
    limit?: number
): Promise<{ tipos: TipoCanto[]; paginaActual?: number; totalPaginas?: number }> => {
    const queryParams = page && limit
        ? `?page=${page}&limit=${limit}`
        : `?all=true`;

    const res = await api.get(`/tipos-canto${queryParams}`);
    return res.data;
};

// Obtener tipos de canto públicos (sin token)
export const obtenerTiposDeCantoPublicos = async (): Promise<TipoCanto[]> => {
    const res = await publicApi.get<{ tipos: TipoCanto[] }>('/tipos-canto/public');
    return res.data.tipos;
};

// Obtener tipo de canto por ID (privado)
export const obtenerTipoCantoPorId = async (id: string): Promise<TipoCanto> => {
    const res = await api.get(`/tipos-canto/${id}`);
    return res.data;
};

// Crear nuevo tipo de canto
export const crearTipoCanto = async (nuevo: FormTipoCanto): Promise<TipoCanto> => {
    const res = await api.post('/tipos-canto/new', nuevo);
    return res.data;
};

export const actualizarTipo = async (id: string, data: FormTipoCanto): Promise<TipoCanto> => {
    const res = await api.put(`/tipos-canto/${id}`, data);
    return res.data;
};

// Eliminar tipo de canto
export const eliminarTipoCanto = async (id: string): Promise<void> => {
    await api.delete(`/tipos-canto/${id}`);
};
