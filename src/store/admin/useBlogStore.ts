import { create } from 'zustand';
import { getAllPosts, getPostById, createPost, updatePost, deletePost, likePost, commentPost } from '../../services/admin/blog';
import type { BlogPost, CreateBlogPayload } from '../../types/blog';

interface AdminBlogState {
    posts: BlogPost[];
    currentPost: BlogPost | null;
    loading: boolean;
    error: string | null;

    fetchPosts: () => Promise<void>;
    getPost: (id: string) => Promise<BlogPost | null>;
    addPost: (payload: CreateBlogPayload) => Promise<void>;
    editPost: (id: string, payload: Partial<CreateBlogPayload>) => Promise<void>;
    removePost: (id: string) => Promise<void>;
    toggleLike: (id: string) => Promise<void>;
    addComment: (id: string, text: any) => Promise<void>;
}

export const useBlogStore = create<AdminBlogState>((set, get) => ({
    posts: [],
    currentPost: null,
    loading: false,
    error: null,

    fetchPosts: async () => {
        set({ loading: true, error: null });
        try {
            const data = await getAllPosts();
            set({ posts: data });
        } catch (e: any) {
            set({ error: e.message || 'Error fetching posts' });
        } finally {
            set({ loading: false });
        }
    },

    getPost: async (id) => {
        set({ loading: true, error: null });
        try {
            const post = await getPostById(id);
            set({ currentPost: post });
            return post;
        } catch (e: any) {
            set({ error: e.message });
            return null;
        } finally {
            set({ loading: false });
        }
    },

    addPost: async (payload) => {
        set({ loading: true, error: null });
        try {
            await createPost(payload);
            await get().fetchPosts();
        } catch (e: any) {
            throw e;
        } finally {
            set({ loading: false });
        }
    },

    editPost: async (id, payload) => {
        set({ loading: true, error: null });
        try {
            await updatePost(id, payload);
            await get().fetchPosts();
        } catch (e: any) {
            throw e;
        } finally {
            set({ loading: false });
        }
    },

    removePost: async (id) => {
        try {
            await deletePost(id);
            set(state => ({ posts: state.posts.filter(p => p.id !== id) }));
        } catch (e) { throw e; }
    },

    toggleLike: async (id) => {
        try {
            await likePost(id);
        } catch (e) { throw e; }
    },

    addComment: async (id, text) => {
        try {
            await commentPost(id, text);
            await get().getPost(id);
        } catch (e) { throw e; }
    }
}));