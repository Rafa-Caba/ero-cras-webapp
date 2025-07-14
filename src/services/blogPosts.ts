import api, { publicApi } from "../api/axios";
import type { JSONContent } from '@tiptap/react';
import type {
    BlogPost,
    BlogPostUpdateResponse,
    BlogPostDeleteResponse,
    BlogPostLikeResponse,
    BlogPostComentarioResponse,
    BlogPostsResponse,
} from "../types";

// Obtener todos paginados
export const obtenerBlogPosts = async (pagina = 1, limit = 5): Promise<BlogPostsResponse> => {
    const res = await api.get<BlogPostsResponse>(`/blog-posts?page=${pagina}&limit=${limit}`);
    return res.data;
};

// Obtener uno por ID
export const obtenerBlogPostPorId = async (id: string): Promise<BlogPost> => {
    const res = await api.get<BlogPost>(`/blog-posts/${id}`);
    return res.data;
};

// Crear post
export const crearBlogPost = async (formData: FormData): Promise<BlogPostUpdateResponse> => {
    const res = await api.post<BlogPostUpdateResponse>("/blog-posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// Actualizar post
export const actualizarBlogPost = async (id: string, formData: FormData): Promise<BlogPostUpdateResponse> => {
    const res = await api.put<BlogPostUpdateResponse>(`/blog-posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};

// Eliminar post
export const eliminarBlogPost = async (id: string): Promise<BlogPostDeleteResponse> => {
    const res = await api.delete<BlogPostDeleteResponse>(`/blog-posts/${id}`);
    return res.data;
};

// Buscar
export const buscarBlogPosts = async (q: string): Promise<BlogPost[]> => {
    const res = await api.get<BlogPost[]>(`/blog-posts/buscar?q=${encodeURIComponent(q)}`);
    return res.data;
};

// Toggle Like
export const toggleLikeBlogPost = async (postId: string, userId: string): Promise<BlogPostLikeResponse> => {
    const res = await api.post<BlogPostLikeResponse>(`/blog-posts/${postId}/toggle-like`, { userId });
    return res.data;
};

// Agregar comentario
export const agregarComentarioBlogPost = async (
    postId: string,
    autor: string,
    texto: JSONContent
): Promise<BlogPostComentarioResponse> => {
    const res = await api.post<BlogPostComentarioResponse>(`/blog-posts/${postId}/comentarios`, {
        autor,
        texto,
    });
    return res.data;
};

// Obtener todos los posts públicos
export const getPublicPosts = async (): Promise<BlogPost[]> => {
    const res = await publicApi.get<BlogPost[]>("/blog-posts/publicos");
    return res.data;
};

// Obtener un solo post público por ID
export const getPublicPostById = async (id: string): Promise<BlogPost> => {
    const res = await api.get<BlogPost>(`/blog-posts/publico/${id}`);
    return res.data;
};
