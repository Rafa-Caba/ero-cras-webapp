import type { JSONContent } from '@tiptap/react';

export interface Aviso {
    _id: string;
    titulo: string;
    contenido: JSONContent;
    publicado: boolean;
    imagenUrl?: string;
    imagenPublicId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AvisosResponse {
    avisos: Aviso[];
    paginaActual: number;
    totalPaginas: number;
    totalAvisos: number;
}

export interface AvisoForm {
    titulo: string;
    contenido: JSONContent;
    publicado: boolean;
    imagen: File | null;
}