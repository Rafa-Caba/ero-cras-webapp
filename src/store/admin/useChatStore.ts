import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { io, type Socket } from 'socket.io-client';

import {
    getChatHistory,
    sendTextMessage,
    uploadChatMedia,
    toggleReaction
} from '../../services/admin/chat';
import { getUserDirectory } from '../../services/admin/users';
import type { ChatMessage, MessageType } from '../../types/chat';
import { normalizeChatMessage } from '../../utils/chat/normalizeChatMessage';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

interface ConnectedUser {
    id: string;
    name: string;
    username: string;
    imageUrl?: string;
    _id?: string;
}

interface SocketProps {
    username: string;
    isTyping: boolean;
}

interface ChatState {
    messages: ChatMessage[];
    currentChoirId: string | null;

    connected: boolean;
    socket: Socket | null;
    loading: boolean;
    isSending: boolean;
    hasMoreMessages: boolean;

    onlineUsers: ConnectedUser[];
    allUsers: ConnectedUser[];
    typingUsers: string[];

    connect: (token: string, user: any) => void;
    disconnect: () => void;

    sendMessage: (
        textInput: any,
        file?: File,
        type?: 'image' | 'video' | 'audio' | 'file',
        replyToId?: string
    ) => Promise<void>;

    sendTyping: (isTyping: boolean) => void;
    reactToMessage: (messageId: string, emoji: string) => Promise<void>;

    loadHistory: () => Promise<void>;
    loadMoreMessages: () => Promise<boolean>;
    fetchDirectory: () => Promise<void>;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            messages: [],
            currentChoirId: null,

            onlineUsers: [],
            allUsers: [],
            typingUsers: [],
            connected: false,
            socket: null,
            loading: false,
            isSending: false,
            hasMoreMessages: true,

            loadHistory: async () => {
                set({ loading: true, hasMoreMessages: true });
                try {
                    const history = await getChatHistory(50);
                    const normalized = history.map((m: any) => normalizeChatMessage(m));
                    set({ messages: normalized });
                } catch (error) {
                    console.error('Failed to load chat history', error);
                } finally {
                    set({ loading: false });
                }
            },

            loadMoreMessages: async () => {
                const { messages, loading } = get();
                if (loading || messages.length === 0) return false;

                set({ loading: true });
                try {
                    const oldestMessage = messages[0];
                    const moreMessages = await getChatHistory(50, oldestMessage.createdAt);

                    if (moreMessages.length === 0) {
                        set({ hasMoreMessages: false });
                        return false;
                    }

                    const normalized = moreMessages.map((m: any) => normalizeChatMessage(m));
                    set({ messages: [...normalized, ...messages] });
                    return true;
                } catch (error) {
                    console.error('Failed to load more messages', error);
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            fetchDirectory: async () => {
                try {
                    const data = await getUserDirectory();
                    set({ allUsers: data });
                } catch (e) {
                    console.error('Directory fetch failed', e);
                }
            },

            connect: (token, user) => {
                const state = get();
                if (!token || (state.socket && state.socket.connected)) return;

                const newChoirId: string | null = (user as any)?.choirId
                    ? String((user as any).choirId)
                    : null;

                const { currentChoirId } = state;

                if (newChoirId && currentChoirId && newChoirId !== currentChoirId) {
                    set({
                        messages: [],
                        hasMoreMessages: true,
                        currentChoirId: newChoirId
                    });
                } else if (!currentChoirId && newChoirId) {
                    set({ currentChoirId: newChoirId });
                }

                const socket = io(SOCKET_URL, {
                    auth: { token, user },
                    transports: ['websocket'],
                    reconnection: true
                });

                socket.on('connect', () => set({ connected: true }));

                socket.on('disconnect', () =>
                    set({
                        connected: false,
                        onlineUsers: []
                    })
                );

                socket.on('new-message', (incoming: any) => {
                    const newMessage = normalizeChatMessage(incoming);

                    if (newChoirId && newMessage.choirId && newMessage.choirId !== newChoirId) {
                        return;
                    }

                    set((current) => {
                        if (current.messages.some((m) => m.id === newMessage.id)) return current;
                        return { messages: [...current.messages, newMessage] };
                    });
                });

                socket.on('message-updated', (incoming: any) => {
                    const updatedMessage = normalizeChatMessage(incoming);

                    if (newChoirId && updatedMessage.choirId && updatedMessage.choirId !== newChoirId) {
                        return;
                    }

                    set((current) => ({
                        messages: current.messages.map((m) =>
                            m.id === updatedMessage.id ? updatedMessage : m
                        )
                    }));
                });

                socket.on('online-users', (users: ConnectedUser[]) => {
                    const uniqueUsers = users.filter(
                        (v, i, a) => a.findIndex((v2) => v2.id === v.id) === i
                    );
                    set({ onlineUsers: uniqueUsers });
                });

                socket.on('user-typing', ({ username, isTyping }: SocketProps) => {
                    set((state) => {
                        let newTyping = [...state.typingUsers];
                        if (isTyping) {
                            if (!newTyping.includes(username)) newTyping.push(username);
                        } else {
                            newTyping = newTyping.filter((u) => u !== username);
                        }
                        return { typingUsers: newTyping };
                    });
                });

                set({ socket });
            },

            disconnect: () => {
                get().socket?.disconnect();
                set({
                    connected: false,
                    socket: null,
                    onlineUsers: [],
                    typingUsers: [],
                    messages: [],
                    currentChoirId: null,
                    hasMoreMessages: true
                });
            },

            sendTyping: (isTyping) => {
                const { socket } = get();
                if (socket?.connected) socket.emit('typing', isTyping);
            },

            reactToMessage: async (messageId, emoji) => {
                try {
                    const updated = await toggleReaction(messageId, emoji);
                    const normalized = normalizeChatMessage(updated);
                    set((current) => ({
                        messages: current.messages.map((m) =>
                            m.id === normalized.id ? normalized : m
                        )
                    }));
                } catch (e) {
                    console.error('Reaction failed', e);
                }
            },

            sendMessage: async (textInput, file, fileKind, replyToId) => {
                const { socket } = get();
                if (!socket) {
                    alert('No hay conexión de chat.');
                    return;
                }

                set({ isSending: true });

                try {
                    get().sendTyping(false);

                    let uploadedUrl = '';
                    let messageType: MessageType = 'TEXT';

                    if (file && fileKind) {
                        uploadedUrl = await uploadChatMedia(file, fileKind);

                        switch (fileKind) {
                            case 'video':
                                messageType = 'VIDEO';
                                break;
                            case 'image':
                                messageType = 'IMAGE';
                                break;
                            case 'audio':
                                messageType = 'AUDIO';
                                break;
                            case 'file':
                                messageType = 'FILE';
                                break;
                            default:
                                messageType = 'TEXT';
                                break;
                        }
                    }

                    let finalContent: any = {};

                    if (typeof textInput === 'string') {
                        finalContent = {
                            type: 'doc',
                            content: textInput
                                ? [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: textInput
                                            }
                                        ]
                                    }
                                ]
                                : []
                        };
                    } else {
                        finalContent = textInput;
                    }

                    const payload = {
                        content: finalContent,
                        type: messageType,
                        ...(uploadedUrl ? { fileUrl: uploadedUrl, filename: file?.name } : {}),
                        ...(replyToId ? { replyToId } : {})
                    };

                    const sentRaw = await sendTextMessage(payload);
                    const sentMessage = normalizeChatMessage(sentRaw);

                    set((current) => {
                        if (current.messages.some((m) => m.id === sentMessage.id)) {
                            return current;
                        }
                        return { messages: [...current.messages, sentMessage] };
                    });
                } catch (err) {
                    console.error('Send Error:', err);
                } finally {
                    set({ isSending: false });
                }
            }
        }),
        {
            name: 'chat-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                messages: state.messages,
                currentChoirId: state.currentChoirId
            })
        }
    )
);
