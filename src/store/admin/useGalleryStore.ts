import { create } from 'zustand';
import { getAdminGallery, addImage, removeImage, setFlags, getGalleryImageById, updateGalleryImage } from '../../services/admin/gallery';
import type { GalleryImage, CreateGalleryPayload } from '../../types/gallery';

interface AdminGalleryState {
    images: GalleryImage[];
    loading: boolean;
    currentImage: GalleryImage | null;

    fetchGallery: () => Promise<void>;
    getImage: (id: string) => Promise<GalleryImage | null>;
    editImage: (id: string, formData: FormData) => Promise<void>;
    uploadImage: (payload: CreateGalleryPayload) => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
    updateFlags: (id: string, flags: any) => Promise<void>;
}

export const useGalleryStore = create<AdminGalleryState>((set, get) => ({
    images: [],
    loading: false,
    currentImage: null,

    fetchGallery: async () => {
        set({ loading: true });
        try {
            const data = await getAdminGallery();
            set({ images: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    },

    getImage: async (id) => {
        set({ loading: true });
        try {
            const image = await getGalleryImageById(id);
            set({ currentImage: image });
            return image;
        } catch (e) {
            console.error(e);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    editImage: async (id, formData) => {
        set({ loading: true });
        try {
            await updateGalleryImage(id, formData);
            await get().fetchGallery();
        } catch (e) { throw e; }
        finally { set({ loading: false }); }
    },

    uploadImage: async (payload) => {
        set({ loading: true });
        try {
            await addImage(payload);
            await get().fetchGallery();
        } catch (e) { throw e; }
        finally { set({ loading: false }); }
    },

    deleteImage: async (id) => {
        try {
            await removeImage(id);
            set(state => ({ images: state.images.filter(i => i.id !== id) }));
        } catch (e) { throw e; }
    },

    updateFlags: async (id, flags) => {
        try {
            // Optimistic UI update
            set(state => {
                const newImages = state.images.map(img => {
                    if (img.id !== id) {
                        // If setting an exclusive flag, turn it off for others
                        const exclusiveKeys = ['imageStart', 'imageLogo', 'imageTopBar', 'imageUs'];
                        let reset = { ...img };
                        exclusiveKeys.forEach(k => { if (flags[k]) (reset as any)[k] = false; });
                        return reset;
                    }
                    return { ...img, ...flags };
                });
                return { images: newImages };
            });
            await setFlags(id, flags);
        } catch (e) { throw e; }
    }
}));