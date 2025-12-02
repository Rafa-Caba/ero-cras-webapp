import { create } from 'zustand';
import { getPublicThemes } from '../../services/public/theme';
import type { Theme } from '../../types/theme';

interface PublicThemeState {
    themes: Theme[];
    loading: boolean;
    fetchThemes: () => Promise<void>;
}

export const useThemeStore = create<PublicThemeState>((set) => ({
    themes: [],
    loading: false,
    fetchThemes: async () => {
        try {
            const data = await getPublicThemes();
            set({ themes: data });
        } catch (e) { console.error(e); }
    }
}));