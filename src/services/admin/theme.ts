import api from '../../api/axios';
import type { Theme, CreateThemePayload } from '../../types/theme';

type ThemeFilterParams = {
    choirId?: string;
    choirKey?: string;
};

export const getAllThemes = async (params?: ThemeFilterParams): Promise<Theme[]> => {
    const { data } = await api.get<{ themes: Theme[] }>('/themes', {
        params: {
            ...(params || {}),
            all: 'true'
        }
    });
    return data.themes || [];
};

export const getThemeById = async (id: string): Promise<Theme> => {
    const { data } = await api.get<Theme>(`/themes/${id}`);
    return data;
};

export const createTheme = async (payload: CreateThemePayload): Promise<Theme> => {
    const { data } = await api.post<{ theme: Theme }>('/themes', payload);
    return data.theme;
};

export const updateTheme = async (
    id: string,
    payload: Partial<CreateThemePayload>
): Promise<Theme> => {
    const { data } = await api.put<{ theme: Theme }>(`/themes/${id}`, payload);
    return data.theme;
};

export const deleteTheme = async (id: string): Promise<void> => {
    await api.delete(`/themes/${id}`);
};
