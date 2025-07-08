import { create } from 'zustand';
import { getPublicPostById, getPublicPosts } from '../../services/blogPosts';
import type { BlogPost } from '../../types';

interface PublicBlogPostsState {
    posts: BlogPost[];
    postSeleccionado: BlogPost | null;
    cargando: boolean;
    error: string | null;

    fetchPublicPosts: () => Promise<void>;
    fetchPublicPostPorId: (id: string) => Promise<BlogPost>;
    limpiarPostSeleccionado: () => void;
}

export const usePublicBlogStore = create<PublicBlogPostsState>()((set) => ({
    posts: [],
    postSeleccionado: null,
    cargando: false,
    error: null,

    fetchPublicPosts: async () => {
        try {
            set({ cargando: true, error: null });
            const data = await getPublicPosts();
            set({ posts: data, cargando: false });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    },

    fetchPublicPostPorId: async (id: string) => {
        try {
            set({ cargando: true, error: null });
            const post = await getPublicPostById(id);
            set({ postSeleccionado: post, cargando: false });
            return post;
        } catch (error: any) {
            set({ error: error.message, cargando: false });
            throw error;
        }
    },

    limpiarPostSeleccionado: () => set({ postSeleccionado: null })
}));
