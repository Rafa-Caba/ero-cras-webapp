import api from '../../api/axios';
import type { ChatMessage } from '../../types/chat';

const createChatFormData = (file: File, type: 'image' | 'video' | 'audio' | 'file') => {
    const formData = new FormData();
    let filename = file.name;
    if (type === 'video' && !filename.endsWith('.mp4')) filename += '.mp4';
    formData.append('file', file, filename);
    return formData;
};

export const getChatHistory = async (limit = 50, before?: string): Promise<ChatMessage[]> => {
    const query = before ? `?limit=${limit}&before=${before}` : `?limit=${limit}`;
    const { data } = await api.get<ChatMessage[]>(`/chat/history${query}`);
    return data;
};

export const uploadChatMedia = async (file: File, type: 'image' | 'video' | 'audio' | 'file') => {
    const formData = createChatFormData(file, type);
    let endpoint = '/chat/upload-file';
    if (type === 'image') endpoint = '/chat/upload-image';
    else if (type === 'video' || type === 'audio') endpoint = '/chat/upload-media';

    const { data } = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    const msg = data.message;
    return msg?.fileUrl || msg?.imageUrl || msg?.audioUrl || data.url || "";
};

export const sendTextMessage = async (content: any): Promise<ChatMessage> => {
    const { data } = await api.post<ChatMessage>('/chat', { content, type: 'TEXT' });
    return data;
};

export const toggleReaction = async (messageId: string, emoji: string): Promise<ChatMessage> => {
    const { data } = await api.patch<{ message: ChatMessage }>(`/chat/${messageId}/reaction`, { emoji });
    return data.message;
};