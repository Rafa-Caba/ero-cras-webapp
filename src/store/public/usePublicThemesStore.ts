import { create } from 'zustand';
import { obtenerTemasPublicos } from '../../services/themes';
import type { Theme } from '../../types';

interface PublicThemesState {
    themes: Theme[];
    cargando: boolean;
    error: string | null;
    fetchThemesPublicos: () => Promise<void>;
}

export const usePublicThemesStore = create<PublicThemesState>((set) => ({
    themes: [],
    cargando: false,
    error: null,

    fetchThemesPublicos: async () => {
        try {
            set({ cargando: true, error: null });
            const temas = await obtenerTemasPublicos();
            set({ themes: temas, cargando: false });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    }
}));