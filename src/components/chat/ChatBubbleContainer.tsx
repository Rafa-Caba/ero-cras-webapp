// src/components/chat/ChatBubbleContainer.tsx

import {
    Box,
    CircularProgress,
    Typography,
} from '@mui/material';

import { AdminChatBubbles } from './AdminChatBubbles';
import type { ChatMessage } from '../../types/chat';
import { getDateTag } from '../../utils/chat/getDateTag';

interface Props {
    messages: ChatMessage[];
    messagesContainerRef: React.RefObject<HTMLDivElement | null>;
    isLoadingMore: boolean;
    hasMoreMessages: boolean;
    isOwnMessage: (authorId: string) => boolean;
    onImageClick: (url: string) => void;
    onPreviewClick: (
        type: 'image' | 'file' | 'audio' | 'video',
        url: string,
        name?: string,
    ) => void;
    onReply: (message: ChatMessage) => void;
}

export const ChatBubbleContainer = ({
    messages,
    messagesContainerRef,
    isLoadingMore,
    hasMoreMessages,
    isOwnMessage,
    onImageClick,
    onPreviewClick,
    onReply,
}: Props) => {
    const groupedMessages = messages.reduce<Record<string, ChatMessage[]>>((accumulator, message) => {
        let label = 'Sin fecha';

        if (message.createdAt) {
            try {
                label = getDateTag(message.createdAt);
            } catch (error) {
                console.warn('Invalid createdAt in message', message.id, message.createdAt, error);
            }
        } else {
            console.warn('Message without createdAt:', message);
        }

        if (!accumulator[label]) {
            accumulator[label] = [];
        }

        accumulator[label].push(message);

        return accumulator;
    }, {});

    return (
        <Box
            ref={messagesContainerRef}
            sx={{
                flex: 1,
                minHeight: {
                    xs: 280,
                    md: 400,
                },
                maxHeight: {
                    xs: '100%',
                    md: '62vh',
                },
                overflowY: 'auto',
                overflowX: 'hidden',
                p: {
                    xs: 1,
                    md: 1.5,
                },
                borderRadius: 1.5,
                backgroundColor:
                    'color-mix(in srgb, var(--color-card) 84%, var(--color-primary) 16%)',
                border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
            }}
        >
            {!hasMoreMessages && messages.length > 0 && (
                <Box sx={{ textAlign: 'center', my: 1.5 }}>
                    <Typography
                        component="span"
                        sx={{
                            px: 1.25,
                            py: 0.45,
                            borderRadius: 999,
                            backgroundColor:
                                'color-mix(in srgb, var(--color-secondary-text) 18%, transparent)',
                            color: 'var(--color-secondary-text)',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                        }}
                    >
                        Inicio de la conversación
                    </Typography>
                </Box>
            )}

            {isLoadingMore && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                        color: 'var(--color-primary)',
                    }}
                >
                    <CircularProgress size={16} />
                    <Typography sx={{ fontWeight: 800, fontSize: '0.82rem' }}>
                        Cargando mensajes anteriores...
                    </Typography>
                </Box>
            )}

            <AdminChatBubbles
                groupedMessages={groupedMessages}
                isOwnMessage={isOwnMessage}
                setExpandedImage={onImageClick}
                onPreviewClick={onPreviewClick}
                onReply={onReply}
            />
        </Box>
    );
};