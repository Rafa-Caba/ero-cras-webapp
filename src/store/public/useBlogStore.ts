import { create } from 'zustand';
import { getPublicPosts, getPublicPostById } from '../../services/public/blog';
import type { BlogPost } from '../../types/blog';

interface PublicBlogState {
    posts: BlogPost[];
    currentPost: BlogPost | null;
    loading: boolean;
    fetchPosts: () => Promise<void>;
    fetchPostById: (id: string) => Promise<void>;
}

export const useBlogStore = create<PublicBlogState>((set) => ({
    posts: [],
    currentPost: null,
    loading: false,
    fetchPosts: async () => {
        set({ loading: true });
        try {
            const data = await getPublicPosts();
            set({ posts: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    },
    fetchPostById: async (id) => {
        set({ loading: true });
        try {
            const data = await getPublicPostById(id);
            set({ currentPost: data });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    }
}));