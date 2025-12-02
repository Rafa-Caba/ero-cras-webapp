import { create } from 'zustand';
import { getPublicSongs } from '../../services/public/song';
import type { Song } from '../../types/song';

interface PublicSongState {
    songs: Song[];
    loading: boolean;
    fetchSongs: () => Promise<void>;
}

export const useSongStore = create<PublicSongState>((set) => ({
    songs: [],
    loading: false,
    fetchSongs: async () => {
        set({ loading: true });
        try {
            const data = await getPublicSongs();
            set({ songs: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    }
}));