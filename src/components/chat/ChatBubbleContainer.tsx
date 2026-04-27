// src/components/chat/ChatBubbleContainer.tsx

import { useEffect, useState, type UIEvent } from 'react';

import {
    Box,
    CircularProgress,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';

import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

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

const scrollToBottomThreshold = 180;

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
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

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

    const updateScrollToBottomVisibility = (container: HTMLDivElement): void => {
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

        setShowScrollToBottom(distanceFromBottom > scrollToBottomThreshold);
    };

    const handleMessagesScroll = (event: UIEvent<HTMLDivElement>): void => {
        updateScrollToBottomVisibility(event.currentTarget);
    };

    const handleScrollToBottom = (): void => {
        const container = messagesContainerRef.current;

        if (!container) {
            return;
        }

        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
        });

        setShowScrollToBottom(false);
    };

    useEffect(() => {
        const container = messagesContainerRef.current;

        if (!container) {
            return;
        }

        updateScrollToBottomVisibility(container);
    }, [messages.length, messagesContainerRef]);

    return (
        <Box
            sx={{
                position: 'relative',
                flex: 1,
                minHeight: {
                    xs: 280,
                    md: 400,
                },
                maxHeight: {
                    xs: '100%',
                    md: '62vh',
                },
                minWidth: 0,
            }}
        >
            <Box
                ref={messagesContainerRef}
                onScroll={handleMessagesScroll}
                sx={{
                    height: '100%',
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

            {showScrollToBottom && (
                <Tooltip title="Ir al final">
                    <IconButton
                        type="button"
                        aria-label="Ir al final del chat"
                        onClick={handleScrollToBottom}
                        sx={{
                            position: 'absolute',
                            right: {
                                xs: 12,
                                md: 16,
                            },
                            bottom: {
                                xs: 12,
                                md: 16,
                            },
                            zIndex: 6,
                            width: 42,
                            height: 42,
                            color: 'var(--color-button-text)',
                            backgroundColor: 'var(--color-primary)',
                            border: '1px solid color-mix(in srgb, var(--color-primary) 68%, #ffffff 32%)',
                            boxShadow: '0 14px 34px rgba(15, 23, 42, 0.22)',
                            '&:hover': {
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-primary) 86%, #000000 14%)',
                            },
                        }}
                    >
                        <KeyboardArrowDownRoundedIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    );
};