import api, { publicApi } from '../api/axios';
import type { Setting, SettingsUpdateResponse } from '../types';

// Obtener la configuración para frontend público
export const obtenerSettingsPublicos = async (): Promise<Setting> => {
    const res = await publicApi.get<Setting>('/settings/public');
    return res.data;
};

// Obtener la configuración actual
export const obtenerSettings = async (): Promise<Setting> => {
    const res = await api.get<Setting>('/settings');
    return res.data;
};

// Actualizar configuración por ID
export const actualizarSettings = async (id: string, formData: Partial<Setting>): Promise<SettingsUpdateResponse> => {
    const res = await api.put<SettingsUpdateResponse>(`/settings/${id}`, formData);
    return res.data;
};