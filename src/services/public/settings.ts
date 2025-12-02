import api from '../../api/axios';
import type { AppSettings } from '../../types/settings';

export const getPublicSettings = async (): Promise<AppSettings> => {
    const { data } = await api.get<AppSettings>('/settings/public');
    return data;
};