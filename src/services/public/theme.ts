import api from '../../api/axios';
import type { Theme } from '../../types/theme';

export const getPublicThemes = async (): Promise<Theme[]> => {
    // Backend returns { themes: [] }
    const { data } = await api.get<{ themes: Theme[] }>('/themes/public');
    return data.themes;
};