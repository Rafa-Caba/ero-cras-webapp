import { create } from 'zustand';
import { getAllSongs, createSong, updateSong, deleteSong, getSongById } from '../../services/admin/song';
import type { Song, CreateSongPayload } from '../../types/song';

interface AdminSongState {
    songs: Song[];
    loading: boolean;

    fetchSongs: () => Promise<void>;
    getSong: (id: string) => Promise<Song | null>;
    addSong: (payload: CreateSongPayload) => Promise<void>;
    editSong: (id: string, payload: Partial<CreateSongPayload>) => Promise<void>;
    removeSong: (id: string) => Promise<void>;
}

export const useSongStore = create<AdminSongState>((set, get) => ({
    songs: [],
    loading: false,

    fetchSongs: async () => {
        set({ loading: true });
        try {
            const data = await getAllSongs();
            set({ songs: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    },

    getSong: async (id) => {
        set({ loading: true });
        try {
            const song = await getSongById(id);
            return song;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    addSong: async (payload) => {
        set({ loading: true });
        try {
            await createSong(payload);
            await get().fetchSongs();
        } catch (e) { throw e; }
        finally { set({ loading: false }); }
    },

    editSong: async (id, payload) => {
        set({ loading: true });
        try {
            await updateSong(id, payload);
            await get().fetchSongs();
        } catch (e) { throw e; }
        finally { set({ loading: false }); }
    },

    removeSong: async (id) => {
        try {
            await deleteSong(id);
            set(state => ({ songs: state.songs.filter(s => s.id !== id) }));
        } catch (e) { throw e; }
    }
}));