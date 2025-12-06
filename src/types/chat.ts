import type { User } from './auth';
import type { TipTapContent } from './annoucement';

export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'MEDIA' | 'REACTION' | 'AUDIO' | 'VIDEO';

export interface MessageReaction {
    emoji: string;
    user: User | string;
}

export interface ChatReplyPreview {
    id: string;
    username: string;
    textPreview: string;
}

export interface ChatMessage {
    id: string;

    author: User;
    content: TipTapContent;
    type: MessageType;

    // Media fields
    fileUrl?: string;
    filename?: string;
    imageUrl?: string;
    audioUrl?: string;

    reactions: MessageReaction[];
    replyTo?: ChatReplyPreview | null;

    createdAt: string;
    updatedAt: string;
}

export interface NewMessagePayload {
    username: string;
    content: any;
    type: MessageType;
    fileUrl?: string;
    filename?: string;
    replyToId?: string;
}