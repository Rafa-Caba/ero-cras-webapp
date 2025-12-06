import api from '../../api/axios';
import type { ChatMessage, MessageType } from '../../types/chat';

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
    const msg = (data as any).message ?? data;
    return msg?.fileUrl || msg?.imageUrl || msg?.audioUrl || (data as any).url || '';
};

interface SendMessageRequest {
    content: any;
    type: MessageType;
    fileUrl?: string;
    filename?: string;
    replyToId?: string;
}

export const sendTextMessage = async (body: SendMessageRequest): Promise<ChatMessage> => {
    const { data } = await api.post('/chat', body);

    // API might return { message: ChatMessage } or ChatMessage directly
    const msg = (data as any).message ?? data;
    return msg as ChatMessage;
};

export const toggleReaction = async (messageId: string, emoji: string): Promise<ChatMessage> => {
    const { data } = await api.patch(`/chat/${messageId}/reaction`, { emoji });
    const msg = (data as any).message ?? data;
    return msg as ChatMessage;
};
