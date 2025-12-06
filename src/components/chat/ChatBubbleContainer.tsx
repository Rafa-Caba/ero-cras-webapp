import { Spinner } from 'react-bootstrap';
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
        name?: string
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
    onReply
}: Props) => {
    const groupedMessages = messages.reduce((acc, message) => {
        let label = 'Sin fecha';

        if (message.createdAt) {
            try {
                label = getDateTag(message.createdAt);
            } catch (err) {
                console.warn('Invalid createdAt in message', message.id, message.createdAt, err);
            }
        } else {
            console.warn('Message without createdAt:', message);
        }

        if (!acc[label]) acc[label] = [];
        acc[label].push(message);
        return acc;
    }, {} as Record<string, ChatMessage[]>);

    return (
        <div
            ref={messagesContainerRef as React.RefObject<HTMLDivElement>}
            className="chat-mensajes-container chat-scroll-container no_scrollbar chat-container-color rounded p-2 p-md-3 mb-1 mb-lg-2 border overflow-y-auto"
            style={{ minHeight: '400px', maxHeight: '62vh', overflowY: 'auto' }}
        >
            {!hasMoreMessages && messages.length > 0 && (
                <div className="text-center my-3">
                    <span
                        className="badge bg-secondary opacity-50 fw-light"
                        style={{ fontSize: '0.7rem' }}
                    >
                        Inicio de la conversación
                    </span>
                </div>
            )}

            {isLoadingMore && (
                <div className="text-center text-theme-color small mb-2">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Cargando mensajes anteriores...
                </div>
            )}

            <AdminChatBubbles
                groupedMessages={groupedMessages}
                isOwnMessage={isOwnMessage}
                setExpandedImage={onImageClick}
                onPreviewClick={onPreviewClick}
                onReply={onReply}
            />
        </div>
    );
};
