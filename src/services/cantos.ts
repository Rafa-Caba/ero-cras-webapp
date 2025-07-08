import api, { publicApi } from '../api/axios';

export interface Canto {
    _id?: string;
    titulo: string;
    texto: string;
    tipo: string;
    compositor: string;
}

export const obtenerCantos = async () => {
    const res = await api.get<Canto[]>('/cantos');
    return res.data;
};

export const obtenerCantoPorId = async (id: string): Promise<Canto> => {
    const res = await api.get<Canto>(`/cantos/${id}`);
    return res.data;
};

export const crearCanto = async (nuevoCanto: Canto) => {
    const res = await api.post('/cantos', nuevoCanto);
    return res.data;
};

export const actualizarCanto = async (id: string, datos: Canto) => {
    const res = await api.put(`/cantos/${id}`, datos);
    return res.data;
};

export const eliminarCanto = async (id: string) => {
    const res = await api.delete(`/cantos/${id}`);
    return res.data;
};

// Obtener todos los cantos públicamente
export const obtenerCantosPublicos = async () => {
    const res = await publicApi.get<Canto[]>('/cantos/public');
    return res.data;
};