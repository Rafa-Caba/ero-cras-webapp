import { create } from 'zustand';
import { getAllThemes, createTheme, updateTheme, deleteTheme, getThemeById } from '../../services/admin/theme';
import type { Theme, CreateThemePayload } from '../../types/theme';

interface AdminThemeState {
    themes: Theme[];
    loading: boolean;
    // Actions
    fetchThemes: () => Promise<void>;
    getTheme: (id: string) => Promise<Theme | null>;
    addTheme: (payload: CreateThemePayload) => Promise<void>;
    editTheme: (id: string, payload: Partial<CreateThemePayload>) => Promise<void>;
    removeTheme: (id: string) => Promise<void>;
}

export const useThemeStore = create<AdminThemeState>((set, get) => ({
    themes: [],
    loading: false,

    fetchThemes: async () => {
        set({ loading: true });
        try {
            const data = await getAllThemes();
            set({ themes: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    },

    getTheme: async (id) => {
        set({ loading: true });
        try {
            const theme = await getThemeById(id);
            return theme;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    addTheme: async (payload) => {
        set({ loading: true });
        try {
            await createTheme(payload);
            await get().fetchThemes();
        } catch (e) { throw e; }
        finally { set({ loading: false }); }
    },

    editTheme: async (id, payload) => {
        set({ loading: true });
        try {
            await updateTheme(id, payload);
            await get().fetchThemes();
        } catch (e) { throw e; }
        finally { set({ loading: false }); }
    },

    removeTheme: async (id) => {
        try {
            await deleteTheme(id);
            set(state => ({ themes: state.themes.filter(t => t.id !== id) }));
        } catch (e) { throw e; }
    }
}));