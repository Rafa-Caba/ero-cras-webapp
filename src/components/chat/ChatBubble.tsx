import { useState } from 'react';
import { Figure, Button } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import type { ChatMessage } from '../../types/chat';
import { TiptapChatViewer } from '../tiptap-components/TiptapChatViewer';
import { useChatStore } from '../../store/admin/useChatStore';
import { EmojiPickerModal } from './EmojiPickerModal';
import { EmojiFloat } from './EmojiFloat';
import { obtenerIconoArchivo } from '../../utils/functionsFilesNames';
import { useAuth } from '../../context/AuthContext';
import { formatName } from '../../utils';
import { ChatReactions } from './ChatReactions';

interface Props {
    msg: ChatMessage;
    previous?: ChatMessage;
    isOwn: boolean;
    onImageClick: (url: string) => void;
    onAvatarClick: (url: string) => void;
    onPreviewClick: (
        type: 'image' | 'file' | 'audio' | 'video',
        url: string,
        name?: string
    ) => void;
    onReply: (message: ChatMessage) => void;
}

export const ChatBubble = ({
    msg,
    previous,
    isOwn,
    onImageClick,
    onAvatarClick,
    onPreviewClick,
    onReply
}: Props) => {
    const { user } = useAuth();
    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);
    const [showMobileReaction, setShowMobileReaction] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const reactToMessage = useChatStore((state) => state.reactToMessage);

    const hasReacted = msg.reactions?.some((r) => {
        const reactorId = typeof r.user === 'string' ? r.user : r.user.id;
        return reactorId === user?.id;
    });

    const isSameAuthor =
        !!previous && !!previous.author && previous.author.id === msg.author.id;

    const handleEmojiSelect = async (emoji: string) => {
        setFloatingEmoji(emoji);
        setShowEmojiModal(false);
        await reactToMessage(msg.id, emoji);
        setTimeout(() => setFloatingEmoji(null), 1200);
    };

    const replyPreview =
        msg.replyTo && typeof msg.replyTo === 'object'
            ? (msg.replyTo as { username?: string; textPreview?: string })
            : null;

    let timeLabel = '';
    if (msg.createdAt) {
        try {
            timeLabel = format(parseISO(msg.createdAt), 'HH:mm', { locale: es });
        } catch (e) {
            console.warn('Invalid createdAt in ChatBubble:', msg.id, msg.createdAt, e);
            timeLabel = '';
        }
    }

    return (
        <div
            className={`w-75 d-flex mb-3 ${isOwn ? 'justify-content-end ms-auto' : 'justify-content-start me-auto'
                }`}
        >
            <div className={`flex items-end gap-2 rounded ${isOwn ? 'flex-row-reverse' : ''}`}>
                <div className="d-flex flex-row mb-1 gap-2">
                    {!isSameAuthor ? (
                        <Button
                            variant="link"
                            className={`p-0 rounded border-0 align-self-end mb-3 ${isOwn ? 'order-2' : 'order-1'
                                }`}
                            onClick={() => onAvatarClick(msg.author.imageUrl || '')}
                        >
                            <img
                                src={msg.author.imageUrl || '/images/default-user.png'}
                                height={32}
                                width={32}
                                alt={msg.author.name}
                                className="rounded-circle shadow-sm"
                                style={{ objectFit: 'cover' }}
                            />
                        </Button>
                    ) : (
                        <div style={{ width: 32 }} className={isOwn ? 'order-2' : 'order-1'}></div>
                    )}

                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={isOwn ? 'order-1' : 'order-2'}
                    >
                        <div
                            className="position-relative chat-bubble-container"
                            onClick={() => {
                                if (window.innerWidth <= 768) {
                                    setShowMobileReaction(!showMobileReaction);
                                }
                            }}
                        >
                            <div
                                className={`p-2 px-2 shadow-sm rounded-3 ${isOwn
                                    ? 'text-end ms-auto chat-sender-container'
                                    : 'text-start me-auto chat-receiver-container'
                                    }`}
                            >
                                {!isSameAuthor && !isOwn && (
                                    <div className="text-xs fw-bold mb-1 chat-user-titulo">
                                        {formatName(msg.author.name)}
                                    </div>
                                )}

                                <div className={`mensaje-burbuja ${isOwn ? 'text-end' : 'text-start'}`}>
                                    {replyPreview && (
                                        <div
                                            className="mb-2 d-flex align-items-start rounded flex-row"
                                            style={{
                                                padding: '6px 8px',
                                                backgroundColor: isOwn
                                                    ? 'rgba(0,0,0,0.10)'
                                                    : 'rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 3,
                                                    borderRadius: 999,
                                                    marginRight: 8,
                                                    alignSelf: 'stretch',
                                                    backgroundColor: isOwn
                                                        ? '#ffffff'
                                                        : 'var(--bs-primary)'
                                                }}
                                            />
                                            <div style={{ flex: 1, minWidth: 0, textAlign: 'start' }}>
                                                <div
                                                    className="fw-semibold"
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: isOwn ? '#ffffff' : 'var(--bs-primary)'
                                                    }}
                                                >
                                                    {replyPreview.username || 'Usuario'}
                                                </div>
                                                <div
                                                    className="text-truncate-2-lines"
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: isOwn ? '#ffffff' : '#f8f9fa',
                                                        overflow: 'hidden',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                >
                                                    {replyPreview.textPreview || ''}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* IMAGE */}
                                    {msg.type === 'IMAGE' && msg.fileUrl && (
                                        <Button
                                            variant="link"
                                            className="p-0 border-0"
                                            onClick={() => onImageClick(msg.fileUrl!)}
                                        >
                                            <Figure className="m-0">
                                                <Figure.Image
                                                    src={msg.fileUrl}
                                                    className="rounded"
                                                    style={{
                                                        width: '200px',
                                                        height: '150px',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </Figure>
                                        </Button>
                                    )}

                                    {/* VIDEO */}
                                    {msg.type === 'VIDEO' && msg.fileUrl && (
                                        <Button
                                            variant="link"
                                            className="p-0 border-0 position-relative"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                onPreviewClick('video', msg.fileUrl!, msg.filename);
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '200px',
                                                    height: '150px',
                                                    overflow: 'hidden',
                                                    position: 'relative'
                                                }}
                                                className="rounded bg-black"
                                            >
                                                <video
                                                    src={msg.fileUrl}
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover', opacity: 0.8 }}
                                                    preload="metadata"
                                                />
                                                <div className="position-absolute top-50 start-50 translate-middle">
                                                    <div
                                                        className="bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center"
                                                        style={{ width: 40, height: 40 }}
                                                    >
                                                        <FontAwesomeIcon icon={faPlay} className="text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Button>
                                    )}

                                    {/* FILE / AUDIO */}
                                    {(msg.type === 'FILE' || msg.type === 'AUDIO') &&
                                        msg.fileUrl && (
                                            <Button
                                                variant="link"
                                                className="p-0 border-0 text-decoration-none"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    onPreviewClick(
                                                        msg.type === 'AUDIO' ? 'audio' : 'file',
                                                        msg.fileUrl!,
                                                        msg.filename
                                                    );
                                                }}
                                            >
                                                <div className="d-flex align-items-center gap-2 bg-white bg-opacity-25 p-2 rounded">
                                                    <FontAwesomeIcon
                                                        icon={obtenerIconoArchivo(msg.filename || '')}
                                                        className="text-current"
                                                    />
                                                    <span
                                                        className="small text-truncate"
                                                        style={{ maxWidth: '150px' }}
                                                    >
                                                        {msg.filename}
                                                    </span>
                                                </div>
                                            </Button>
                                        )}

                                    {/* TEXT (TipTap content) */}
                                    {(msg.type === 'TEXT' || (msg.content as any)?.content) && (
                                        <div className="chat-text-color">
                                            <TiptapChatViewer content={msg.content as any} />
                                        </div>
                                    )}
                                </div>

                                {/* time */}
                                <div
                                    className="text-end"
                                    style={{ fontSize: '0.65rem', opacity: 0.8 }}
                                >
                                    {timeLabel}
                                </div>
                            </div>

                            {/* Reactions + actions */}
                            <div
                                className={`chat-reactions-wrapper ${isOwn ? 'reaction-sender' : 'reaction-receiver'
                                    }`}
                            >
                                {msg.reactions && msg.reactions.length > 0 && (
                                    <div className="chat-reactions-display">
                                        <ChatReactions messageId={msg.id} reactions={msg.reactions} />
                                    </div>
                                )}

                                <div className="position-relative d-inline-block">
                                    <Button
                                        size="sm"
                                        variant="light"
                                        className={`chat-reaccion-btn ${showMobileReaction || showActions ? 'visible' : ''
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowActions((prev) => !prev);
                                        }}
                                    >
                                        🙂
                                    </Button>

                                    {showActions && (
                                        <div
                                            className={`chat-action-menu shadow-sm rounded bg-white border small ${isOwn ? 'text-end' : 'text-start'
                                                }`}
                                            style={{
                                                position: 'absolute',
                                                bottom: '110%',
                                                [isOwn ? 'right' : 'left']: 0,
                                                zIndex: 20,
                                                minWidth: '130px'
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {!hasReacted && (
                                                <button
                                                    type="button"
                                                    className="w-100 text-start border-0 bg-transparent px-2 py-1 small"
                                                    onClick={() => {
                                                        setShowActions(false);
                                                        setShowEmojiModal(true);
                                                    }}
                                                >
                                                    😀 Reaccionar
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className="w-100 text-start border-0 bg-transparent px-2 py-1 small"
                                                onClick={() => {
                                                    setShowActions(false);
                                                    onReply(msg);
                                                }}
                                            >
                                                ↩ Responder
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <EmojiPickerModal
                show={showEmojiModal}
                onClose={() => setShowEmojiModal(false)}
                onSelect={handleEmojiSelect}
            />

            {floatingEmoji && <EmojiFloat emoji={floatingEmoji} side={isOwn ? 'right' : 'left'} />}
        </div>
    );
};
