import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { JSONContent } from '@tiptap/react';

import {
    actualizarBlogPost,
    agregarComentarioBlogPost,
    buscarBlogPosts,
    crearBlogPost,
    eliminarBlogPost,
    obtenerBlogPostPorId,
    obtenerBlogPosts,
    toggleLikeBlogPost,
} from '../../services/blogPosts';
import type { BlogPost, BlogPostsResponse } from '../../types';

interface BlogPostsState {
    posts: BlogPost[];
    postSeleccionado: BlogPost | null;
    cargando: boolean;
    error: string | null;
    paginaActual: number;
    totalPaginas: number;
    totalPosts: number;

    // Acciones
    fetchPosts: (pagina?: number, limite?: number) => Promise<void>;
    fetchPostPorId: (id: string) => Promise<BlogPost>;
    crearNuevoPost: (formData: FormData) => Promise<void>;
    actualizarPostExistente: (id: string, formData: FormData) => Promise<void>;
    eliminarPostPorId: (id: string) => Promise<void>;
    buscarPostsPorTexto: (q: string) => Promise<void>;
    darLike: (postId: string, userId: string) => Promise<void>;
    comentarEnPost: (postId: string, autor: string, texto: JSONContent) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
}

export const useBlogPostsStore = create<BlogPostsState>()(
    persist(
        (set) => ({
            posts: [],
            postSeleccionado: null,
            cargando: false,
            error: null,
            paginaActual: 1,
            totalPaginas: 1,
            totalPosts: 0,

            fetchPosts: async (pagina = 1) => {
                try {
                    set({ cargando: true, error: null });
                    const data: BlogPostsResponse = await obtenerBlogPosts(pagina);
                    set({
                        posts: data.posts,
                        paginaActual: data.paginaActual,
                        totalPaginas: data.totalPaginas,
                        totalPosts: data.totalPosts,
                        cargando: false
                    });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            fetchPostPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    const post = await obtenerBlogPostPorId(id);
                    set({ postSeleccionado: post, cargando: false });
                    return post;
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            crearNuevoPost: async (formData) => {
                try {
                    set({ cargando: true, error: null });
                    await crearBlogPost(formData);
                    const { posts } = await obtenerBlogPosts();
                    set({ posts, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            actualizarPostExistente: async (id, formData) => {
                try {
                    set({ cargando: true, error: null });
                    await actualizarBlogPost(id, formData);
                    const { posts } = await obtenerBlogPosts();
                    set({ posts, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            eliminarPostPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    await eliminarBlogPost(id);
                    const { posts } = await obtenerBlogPosts();
                    set({ posts, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            buscarPostsPorTexto: async (q) => {
                try {
                    set({ cargando: true, error: null });
                    const resultados = await buscarBlogPosts(q);
                    set({ posts: resultados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            darLike: async (postId, userId) => {
                try {
                    await toggleLikeBlogPost(postId, userId);
                    const { posts } = await obtenerBlogPosts();
                    set({ posts });
                } catch (error: any) {
                    set({ error: error.message });
                }
            },

            comentarEnPost: async (postId, autor, texto) => {
                try {
                    await agregarComentarioBlogPost(postId, autor, texto);
                    const { posts } = await obtenerBlogPosts();
                    set({ posts });
                } catch (error: any) {
                    set({ error: error.message });
                }
            },

            setPaginaActual: (pagina) => set({ paginaActual: pagina })
        }),
        {
            name: 'blog-posts-store'
        }
    )
);
