import type { JSONContent } from '@tiptap/react';
import type { Usuario } from './usuarios';

export interface ReaccionMensaje {
    emoji: string;
    usuario: string;
}

export interface ChatMessage {
    _id: string;
    autor: Usuario;
    contenido: JSONContent;
    tipo: 'texto' | 'imagen' | 'archivo' | 'reaccion';
    archivoUrl?: string;
    archivoNombre?: string;
    imagenUrl?: string;
    imagenPublicId?: string;
    reacciones?: ReaccionMensaje[];
    createdAt: string;
}

export interface NuevoMensaje {
    autor: Usuario;
    contenido: JSONContent;
    tipo: 'texto' | 'imagen' | 'archivo' | 'reaccion';
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
    noHayMasMensajes: boolean;
    cargando: boolean;
    error: string | null;

    fetchMensajes: () => Promise<void>;
    fetchMensajesAnteriores: () => Promise<void>;
    agregarMensajeTexto: (nuevoMensaje: NuevoMensaje) => Promise<ChatMessage>;
    agregarMensajeArchivo: (formData: FormData) => Promise<ChatMessage>;
    agregarMensajeSocket: (mensaje: ChatMessage) => void;
    reaccionarAMensajeEnStore: (mensajeId: string, emoji: string) => Promise<void>;
    subirImagenYObtenerUrl: (file: File) => Promise<ImagenSubida | null>;
    limpiarMensajes: () => void;
    actualizarMensajeReaccion: (mensajeActualizado: ChatMessage) => void; // 👈 Agregado
}
