import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { obtenerSettings, actualizarSettings } from '../../services/settings';
import type { Setting } from '../../types/settings';

interface SettingsState {
    settings: Setting | null;
    cargando: boolean;
    error: string | null;

    fetchSettings: () => Promise<void>;
    actualizarSettingsExistente: (id: string, formData: Partial<Setting>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            settings: null,
            cargando: false,
            error: null,

            fetchSettings: async () => {
                try {
                    set({ cargando: true, error: null });
                    const data = await obtenerSettings();
                    set({ settings: data, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            actualizarSettingsExistente: async (id, formData) => {
                try {
                    set({ cargando: true, error: null });
                    const res = await actualizarSettings(id, formData);
                    if (res.settingActualizado) {
                        set({ settings: res.settingActualizado, cargando: false });
                    } else {
                        set({ cargando: false });
                    }
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },
        }),
        {
            name: 'settings-store', // clave para persistencia local
        }
    )
);
