import { create } from 'zustand';
import { getPublicSongTypes } from '../../services/public/songType';
import type { SongType } from '../../types/song';

interface PublicSongTypeState {
    types: SongType[];
    loading: boolean;
    fetchTypes: () => Promise<void>;
}

export const useSongTypeStore = create<PublicSongTypeState>((set) => ({
    types: [],
    loading: false,
    fetchTypes: async () => {
        set({ loading: true });
        try {
            const data = await getPublicSongTypes();
            set({ types: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    }
}));