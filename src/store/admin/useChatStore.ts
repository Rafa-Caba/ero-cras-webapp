import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { io, Socket } from "socket.io-client";
import { getChatHistory, sendTextMessage, uploadChatMedia, toggleReaction } from '../../services/admin/chat';
import { getUserDirectory } from '../../services/admin/users';
import type { ChatMessage } from '../../types/chat';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

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
    sendMessage: (textInput: any, file?: File, type?: 'image' | 'video' | 'audio' | 'file') => Promise<void>;
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
                    set({ messages: history });
                } catch (error) {
                    console.error("Failed to load chat history");
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

                    set({ messages: [...moreMessages, ...messages] });
                    return true;
                } catch (error) {
                    console.error("Failed to load more messages");
                    return false;
                } finally {
                    set({ loading: false });
                }
            },

            fetchDirectory: async () => {
                try {
                    const data = await getUserDirectory();
                    set({ allUsers: data });
                } catch (e) { console.error("Directory fetch failed", e); }
            },

            connect: (token, user) => {
                const state = get();
                if (!token || (state.socket && state.socket.connected)) return;

                const socket = io(SOCKET_URL, {
                    auth: { token, user },
                    transports: ['websocket'],
                    reconnection: true,
                });

                socket.on('connect', () => set({ connected: true }));
                socket.on('disconnect', () => set({ connected: false, onlineUsers: [] }));

                socket.on('new-message', (newMessage: ChatMessage) => {
                    set((current) => {
                        if (current.messages.some(m => m.id === newMessage.id)) return current;
                        return { messages: [...current.messages, newMessage] };
                    });
                });

                socket.on('message-updated', (updatedMessage: ChatMessage) => {
                    set((current) => ({
                        messages: current.messages.map(m => m.id === updatedMessage.id ? updatedMessage : m)
                    }));
                });

                socket.on('online-users', (users: ConnectedUser[]) => {
                    const uniqueUsers = users.filter((v, i, a) => a.findIndex(v2 => v2.id === v.id) === i);
                    set({ onlineUsers: uniqueUsers });
                });

                socket.on('user-typing', ({ username, isTyping }: SocketProps) => {
                    set((state) => {
                        let newTyping = [...state.typingUsers];
                        if (isTyping) {
                            if (!newTyping.includes(username)) newTyping.push(username);
                        } else {
                            newTyping = newTyping.filter(u => u !== username);
                        }
                        return { typingUsers: newTyping };
                    });
                });

                set({ socket });
            },

            disconnect: () => {
                get().socket?.disconnect();
                set({ connected: false, socket: null, onlineUsers: [] });
            },

            sendTyping: (isTyping) => {
                const { socket } = get();
                if (socket?.connected) socket.emit('typing', isTyping);
            },

            reactToMessage: async (messageId, emoji) => {
                try {
                    await toggleReaction(messageId, emoji);
                } catch (e) { console.error("Reaction failed", e); }
            },

            sendMessage: async (textInput, file, type) => {
                const { socket } = get();
                if (!socket) { alert("No connection."); return; }

                set({ isSending: true });
                try {
                    get().sendTyping(false);
                    let uploadedUrl = '';
                    let messageType = 'TEXT';

                    if (file && type) {
                        uploadedUrl = await uploadChatMedia(file, type);
                        switch (type) {
                            case 'video': messageType = 'VIDEO'; break;
                            case 'image': messageType = 'IMAGE'; break;
                            case 'audio': messageType = 'AUDIO'; break;
                            case 'file': messageType = 'FILE'; break;
                        }
                    }

                    let finalContent = {};
                    if (typeof textInput === 'string') {
                        finalContent = {
                            type: 'doc',
                            content: textInput ? [{ type: 'paragraph', content: [{ type: 'text', text: textInput }] }] : []
                        };
                    } else {
                        finalContent = textInput;
                    }

                    const payload: any = {
                        content: finalContent,
                        type: messageType,
                        ...(uploadedUrl ? { fileUrl: uploadedUrl } : {}),
                    };

                    if (!file && textInput) {
                        await sendTextMessage(payload.content);
                    }

                } catch (err) {
                    console.error("Send Error:", err);
                } finally {
                    set({ isSending: false });
                }
            }
        }),
        {
            name: 'chat-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ messages: state.messages }),
        }
    )
);