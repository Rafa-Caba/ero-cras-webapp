import type { JSONContent } from '@tiptap/react';

export interface Comentario {
    autor: string;
    texto: JSONContent;
    fecha: string;
}

export interface BlogPost {
    _id: string;
    titulo: string;
    contenido: JSONContent;
    autor: string;
    imagenUrl?: string;
    imagenPublicId?: string;
    publicado: boolean;
    likes: number;
    likesUsuarios: string[];
    comentarios: Comentario[];
    createdAt?: string;
    updatedAt?: string;
}

export interface BlogPostsResponse {
    posts: BlogPost[];
    paginaActual: number;
    totalPaginas: number;
    totalPosts: number;
}

export interface BlogPostUpdateResponse {
    mensaje: string;
    post: BlogPost;
}

export interface BlogPostDeleteResponse {
    mensaje: string;
}

export interface BlogPostLikeResponse {
    mensaje: string;
    likes: number;
    yaDioLike: boolean;
}

export interface BlogPostComentarioResponse {
    mensaje: string;
    comentarios: Comentario[];
}

export interface BlogPostForm {
    titulo: string;
    contenido: JSONContent;
    autor: string;
    publicado: boolean;
    imagen: File | null;
}