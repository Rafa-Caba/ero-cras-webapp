import { create } from 'zustand';
import { getPublicSettings } from '../../services/public/settings';
import type { AppSettings } from '../../types/settings';

interface PublicSettingsState {
    settings: AppSettings | null;
    loading: boolean;
    fetchSettings: () => Promise<void>;
}

export const useSettingsStore = create<PublicSettingsState>((set) => ({
    settings: null,
    loading: false,
    fetchSettings: async () => {
        set({ loading: true });
        try {
            const data = await getPublicSettings();
            set({ settings: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    }
}));