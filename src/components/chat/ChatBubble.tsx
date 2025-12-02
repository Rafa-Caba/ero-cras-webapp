import { useState } from 'react';
import { Figure, Button } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons'; // Ensure this icon exists

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
    onPreviewClick: (type: 'image' | 'file' | 'audio' | 'video', url: string, name?: string) => void;
}

export const ChatBubble = ({ msg, previous, isOwn, onImageClick, onAvatarClick, onPreviewClick }: Props) => {
    const { user } = useAuth();
    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [floatingEmoji, setFloatingEmoji] = useState<string | null>(null);
    const [showMobileReaction, setShowMobileReaction] = useState(false);

    const reactToMessage = useChatStore((state) => state.reactToMessage);

    const hasReacted = msg.reactions?.some(r => {
        const reactorId = typeof r.user === 'string' ? r.user : r.user.id;
        return reactorId === user?.id;
    });

    const isSameAuthor = previous && previous.author.id === msg.author.id;

    const handleEmojiSelect = async (emoji: string) => {
        setFloatingEmoji(emoji);
        await reactToMessage(msg.id, emoji);
        setTimeout(() => setFloatingEmoji(null), 1200);
    };

    return (
        <div className={`w-75 d-flex mb-3 ${isOwn ? 'justify-content-end ms-auto' : 'justify-content-start me-auto'}`}>
            <div className={`flex items-end gap-2 rounded ${isOwn ? 'flex-row-reverse' : ''}`}>

                <div className={`d-flex flex-row mb-1 gap-2`}>
                    {!isSameAuthor ? (
                        <Button
                            variant="link"
                            className={`p-0 rounded border-0 align-self-end mb-3 ${isOwn ? 'order-2' : 'order-1'}`}
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
                        className={`${isOwn ? 'order-1' : 'order-2'}`}
                    >
                        <div
                            className="position-relative chat-bubble-container"
                            onClick={() => {
                                if (window.innerWidth <= 768) setShowMobileReaction(!showMobileReaction);
                            }}
                        >
                            <div className={`p-2 px-3 shadow-sm rounded-3 ${isOwn ? 'text-end ms-auto chat-sender-container' : 'text-start me-auto chat-receiver-container'}`}>
                                {!isSameAuthor && !isOwn && (
                                    <div className="text-xs fw-bold mb-1 chat-user-titulo">
                                        {formatName(msg.author.name)}
                                    </div>
                                )}

                                <div className={`mensaje-burbuja ${isOwn ? 'text-end' : 'text-start'}`}>

                                    {msg.type === 'IMAGE' && msg.fileUrl && (
                                        <Button variant="link" className="p-0 border-0" onClick={() => onImageClick(msg.fileUrl!)}>
                                            <Figure className="m-0">
                                                <Figure.Image
                                                    src={msg.fileUrl}
                                                    className="rounded"
                                                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                                                />
                                            </Figure>
                                        </Button>
                                    )}

                                    {msg.type === 'VIDEO' && msg.fileUrl && (
                                        <Button
                                            variant="link"
                                            className="p-0 border-0 position-relative"
                                            onClick={(e) => {
                                                e.preventDefault(); e.stopPropagation();
                                                onPreviewClick('video', msg.fileUrl!, msg.filename);
                                            }}
                                        >
                                            <div style={{ width: '200px', height: '150px', overflow: 'hidden', position: 'relative' }} className="rounded bg-black">
                                                <video
                                                    src={msg.fileUrl}
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover', opacity: 0.8 }}
                                                    preload="metadata"
                                                />
                                                <div className="position-absolute top-50 start-50 translate-middle">
                                                    <div className="bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                                        <FontAwesomeIcon icon={faPlay} className="text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Button>
                                    )}

                                    {(msg.type === 'FILE' || msg.type === 'AUDIO') && msg.fileUrl && (
                                        <Button
                                            variant="link"
                                            className="p-0 border-0 text-decoration-none"
                                            onClick={(e) => {
                                                e.preventDefault(); e.stopPropagation();
                                                onPreviewClick(msg.type === 'AUDIO' ? 'audio' : 'file', msg.fileUrl!, msg.filename);
                                            }}
                                        >
                                            <div className="d-flex align-items-center gap-2 bg-white bg-opacity-25 p-2 rounded">
                                                <FontAwesomeIcon icon={obtenerIconoArchivo(msg.filename || '')} className="text-current" />
                                                <span className="small text-truncate" style={{ maxWidth: '150px' }}>{msg.filename}</span>
                                            </div>
                                        </Button>
                                    )}

                                    {(msg.type === 'TEXT' || msg.content?.content) && (
                                        <div className='chat-text-color'>
                                            <TiptapChatViewer content={msg.content as any} />
                                        </div>
                                    )}
                                </div>

                                <div className="text-end mt-1" style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                                    {format(parseISO(msg.createdAt), 'HH:mm', { locale: es })}
                                </div>
                            </div>

                            <div className={`chat-reactions-wrapper ${isOwn ? 'reaction-sender' : 'reaction-receiver'}`}>
                                {msg.reactions && msg.reactions.length > 0 && (
                                    <div className="chat-reactions-display">
                                        <ChatReactions messageId={msg.id} reactions={msg.reactions} />
                                    </div>
                                )}

                                {!hasReacted && (
                                    <Button
                                        size="sm"
                                        variant="light"
                                        className={`chat-reaccion-btn ${showMobileReaction ? 'visible' : ''}`}
                                        onClick={(e) => { e.stopPropagation(); setShowEmojiModal(true); }}
                                    >
                                        🙂
                                    </Button>
                                )}
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

            {floatingEmoji && (
                <EmojiFloat emoji={floatingEmoji} side={isOwn ? 'right' : 'left'} />
            )}
        </div>
    );
};