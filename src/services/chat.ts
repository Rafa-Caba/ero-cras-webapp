import api from '../api/axios';
import type { ChatMessage, ChatMessageResponse, NuevoMensaje } from '../types';

// Obtener los últimos mensajes (limit por defecto: 50)
export const obtenerMensajesChat = async (limit = 50, before?: string): Promise<ChatMessage[]> => {
    const url = before ? `/chat?limit=${limit}&before=${before}` : `/chat?limit=${limit}`;
    const res = await api.get<ChatMessage[]>(url);
    return res.data;
};

// Enviar mensaje de texto
export const enviarMensajeTexto = async (mensaje: NuevoMensaje): Promise<ChatMessageResponse> => {
    const { data } = await api.post<ChatMessageResponse>('/chat', mensaje);
    return data;
};

// Enviar mensaje con archivo (imagen o archivo general)
export const enviarMensajeArchivo = async (formData: FormData): Promise<ChatMessageResponse> => {
    const res = await api.post<ChatMessageResponse>('/chat/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
};

// Subir imagen del chat a Cloudinary
export const subirImagenChat = async (file: File): Promise<{ imagenUrl: string; imagenPublicId: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<{ imagenUrl: string; imagenPublicId: string }>('/chat/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return res.data;
};