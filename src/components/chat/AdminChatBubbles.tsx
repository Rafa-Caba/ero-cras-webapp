// src/components/chat/AdminChatBubbles.tsx

import {
    Box,
    Divider,
    Paper,
    Typography,
} from '@mui/material';

import type { ChatMessage } from '../../types/chat';
import { ChatBubble } from './ChatBubble';

interface Props {
    groupedMessages: Record<string, ChatMessage[]>;
    isOwnMessage: (id: string) => boolean;
    setExpandedImage: (url: string) => void;
    onPreviewClick: (
        type: 'image' | 'file' | 'audio' | 'video',
        url: string,
        name?: string,
    ) => void;
    onReply: (message: ChatMessage) => void;
}

export const AdminChatBubbles = ({
    groupedMessages,
    isOwnMessage,
    setExpandedImage,
    onPreviewClick,
    onReply,
}: Props) => {
    const dates = Object.entries(groupedMessages);

    if (dates.length === 0) {
        return (
            <Box
                sx={{
                    height: '100%',
                    minHeight: 220,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--color-secondary-text)',
                    fontWeight: 800,
                }}
            >
                <Typography sx={{ fontWeight: 850 }}>
                    No hay mensajes
                </Typography>
            </Box>
        );
    }

    return (
        <>
            {dates.map(([date, messagesOfDay]) => (
                <Box key={date}>
                    <Box
                        sx={{
                            position: 'relative',
                            my: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Divider
                            sx={{
                                width: '100%',
                                borderColor:
                                    'color-mix(in srgb, var(--color-border) 44%, transparent)',
                            }}
                        />

                        <Paper
                            elevation={0}
                            sx={{
                                position: 'absolute',
                                px: 1.5,
                                py: 0.25,
                                borderRadius: 999,
                                backgroundColor: 'var(--color-card)',
                                border:
                                    '1px solid color-mix(in srgb, var(--color-border) 36%, transparent)',
                                color: 'var(--color-primary)',
                                fontWeight: 950,
                                fontSize: '0.78rem',
                            }}
                        >
                            {date}
                        </Paper>
                    </Box>

                    {messagesOfDay.map((message, index) => {
                        if (!message || !message.author) {
                            console.warn('Skipping invalid chat message in AdminChatBubbles:', message);
                            return null;
                        }

                        const previous = index > 0 ? messagesOfDay[index - 1] : undefined;

                        return (
                            <ChatBubble
                                key={message.id || `${date}-${index}`}
                                msg={message}
                                previous={previous}
                                isOwn={isOwnMessage(message.author.id)}
                                onImageClick={setExpandedImage}
                                onAvatarClick={setExpandedImage}
                                onPreviewClick={onPreviewClick}
                                onReply={onReply}
                            />
                        );
                    })}
                </Box>
            ))}
        </>
    );
};