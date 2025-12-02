import { create } from 'zustand';
import { getAllSongTypes, createSongType, updateSongType, deleteSongType } from '../../services/admin/songType';
import type { SongType } from '../../types/song';
import { getSongTypeById } from '../../services/admin/song';

interface AdminSongTypeState {
    types: SongType[];
    loading: boolean;
    fetchTypes: () => Promise<void>;
    getType: (id: string) => Promise<SongType | null>;
    addType: (name: string, order: number, parentId?: string | null, isParent?: boolean) => Promise<void>;
    editType: (id: string, name: string, order: number, isParent?: boolean) => Promise<void>;
    removeType: (id: string) => Promise<void>;
}

export const useSongTypeStore = create<AdminSongTypeState>((set, get) => ({
    types: [],
    loading: false,

    fetchTypes: async () => {
        set({ loading: true });
        try {
            const data = await getAllSongTypes();
            set({ types: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    },

    getType: async (id) => {
        set({ loading: true });
        try {
            const type = await getSongTypeById(id);
            return type;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    addType: async (name, order, parentId, isParent) => {
        set({ loading: true });
        try {
            await createSongType({ name, order, parentId: parentId || undefined, isParent });
            await get().fetchTypes();
        } catch (e) { throw e; }
        finally { set({ loading: false }); }
    },

    editType: async (id, name, order, isParent) => {
        set({ loading: true });
        try {
            await updateSongType(id, { name, order, isParent });
            await get().fetchTypes();
        } catch (e) { throw e; }
        finally { set({ loading: false }); }
    },

    removeType: async (id) => {
        try {
            await deleteSongType(id);
            set(state => ({ types: state.types.filter(t => t.id !== id) }));
        } catch (e) { throw e; }
    }
}));