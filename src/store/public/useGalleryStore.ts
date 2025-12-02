import { create } from 'zustand';
import { getPublicGallery } from '../../services/public/gallery';
import type { GalleryImage } from '../../types/gallery';

interface PublicGalleryState {
    images: GalleryImage[];
    loading: boolean;
    fetchGallery: () => Promise<void>;
}

export const useGalleryStore = create<PublicGalleryState>((set) => ({
    images: [],
    loading: false,
    fetchGallery: async () => {
        set({ loading: true });
        try {
            const data = await getPublicGallery();
            set({ images: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    }
}));