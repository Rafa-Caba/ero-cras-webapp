import type { JSONContent } from '@tiptap/react';
import type { Usuario } from './usuarios';

export interface ChatMessage {
    _id: string;
    autor: Usuario;
    contenido: JSONContent;
    tipo: 'texto' | 'imagen' | 'archivo';
    archivoUrl?: string;
    archivoNombre?: string;
    imagenUrl?: string;
    imagenPublicId?: string;
    createdAt: string;
}

export interface NuevoMensaje {
    autor: Usuario;
    contenido: JSONContent;
    tipo?: 'texto' | 'imagen' | 'archivo';
    archivoUrl?: string;
    archivoNombre?: string;
    imagenUrl?: string;
    imagenPublicId?: string;
}

export interface ChatMessageResponse {
    msg: string;
    mensaje: ChatMessage;
}

export interface ImagenSubida {
    imagenUrl: string;
    imagenPublicId: string;
}

export interface ChatState {
    mensajes: ChatMessage[];
    cargando: boolean;
    error: string | null;

    fetchMensajes: () => Promise<void>;
    fetchMensajesAnteriores: () => Promise<void>
    agregarMensajeTexto: (nuevoMensaje: NuevoMensaje) => Promise<ChatMessage>;
    agregarMensajeArchivo: (formData: FormData) => Promise<ChatMessage>;
    agregarMensajeSocket: (mensaje: ChatMessage) => void;
    subirImagenYObtenerUrl: (file: File) => Promise<ImagenSubida | null>;
    limpiarMensajes: () => void;
}
