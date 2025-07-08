import { create } from 'zustand';
import { obtenerSettingsPublicos } from '../../services/settings';
import type { Setting } from '../../types/settings';

interface PublicSettingsState {
    settings: Setting | null;
    cargando: boolean;
    error: string | null;
    fetchSettingsPublicos: () => Promise<void>;
}

export const usePublicSettingsStore = create<PublicSettingsState>((set) => ({
    settings: null,
    cargando: false,
    error: null,

    fetchSettingsPublicos: async () => {
        try {
            set({ cargando: true, error: null });
            const data = await obtenerSettingsPublicos();
            set({ settings: data, cargando: false });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    },
}));
