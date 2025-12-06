import { useEffect, useRef, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { JSONContent } from '@tiptap/react';

import { useChatStore } from '../../store/admin/useChatStore';
import { useAuth } from '../../context/AuthContext';

import { ChatBubbleContainer } from './ChatBubbleContainer';
import { ChatPreviewContainer } from './ChatPreviewContainer';
import { ChatInputArea } from './ChatInputArea';
import { ChatImageModal } from './ChatImageModal';
import { ChatFilePreviewModal } from './ChatFilePreviewModal';
import { ChatDirectory } from './ChatDirectory';

import { scrollChatToBottom } from '../../utils';
import type { ChatMessage } from '../../types/chat';

const getEmptyContent = (): JSONContent => ({
    type: 'doc',
    content: [{ type: 'paragraph' }]
});

export const AdminChatGroup = () => {
    const { user, token } = useAuth();

    const {
        messages,
        isSending,
        hasMoreMessages,
        connect,
        sendMessage,
        loadHistory,
        loadMoreMessages,
        fetchDirectory,
        allUsers,
        onlineUsers
    } = useChatStore();

    const [messageContent, setMessageContent] = useState<JSONContent>(getEmptyContent());

    const [expandedImage, setExpandedImage] = useState<string | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // File & Preview States
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<'image' | 'file' | 'audio' | 'video' | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewName, setPreviewName] = useState<string | undefined>();
    const [previewType, setPreviewType] = useState<'image' | 'file' | 'audio' | 'video' | null>(null);

    // Modal Preview States
    const [modalPreviewType, setModalPreviewType] =
        useState<'image' | 'file' | 'audio' | 'video' | null>(null);
    const [modalPreviewUrl, setModalPreviewUrl] = useState<string | null>(null);
    const [modalPreviewName, setModalPreviewName] = useState<string | undefined>();

    // Reply-to state
    const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);

    const editorRef = useRef<{ clear: () => void }>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const lastMessageIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (token && user) {
            connect(token, user);
            loadHistory();
            fetchDirectory();
        }
    }, [token, user]);

    useEffect(() => {
        if (messages.length === 0) return;
        const currentLastId = messages[messages.length - 1].id;

        if (currentLastId !== lastMessageIdRef.current) {
            lastMessageIdRef.current = currentLastId;
            scrollChatToBottom(messagesContainerRef.current);
        }
    }, [messages]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const handleScroll = async () => {
            if (container.scrollTop === 0 && !isLoadingMore && messages.length > 0 && hasMoreMessages) {
                setIsLoadingMore(true);
                const scrollHeightBefore = container.scrollHeight;

                await loadMoreMessages();

                requestAnimationFrame(() => {
                    const scrollHeightAfter = container.scrollHeight;
                    const heightDifference = scrollHeightAfter - scrollHeightBefore;
                    if (heightDifference > 0) {
                        container.scrollTop = heightDifference;
                    }
                    setIsLoadingMore(false);
                });
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [isLoadingMore, messages.length, hasMoreMessages]);

    const isOwnMessage = (authorId: string) => authorId === user?.id;

    const handleSendMessage = async () => {
        // Validation: deeply check for any text content
        const hasText = messageContent?.content?.some((block: any) =>
            block.content?.some((child: any) => child.text?.trim())
        );

        if (!hasText && !selectedFile) return;
        if (!user) return;

        try {
            await sendMessage(
                messageContent,
                selectedFile || undefined,
                fileType || undefined,
                replyTo?.id
            );

            editorRef.current?.clear();
            setMessageContent(getEmptyContent());
            setSelectedFile(null);
            setFileType(null);
            setPreviewUrl(null);
            setPreviewName(undefined);
            setPreviewType(null);
            setReplyTo(null); // ✅ clear reply after sending
        } catch (error) {
            console.error('Error sending message:', error);
            Swal.fire('Error', 'Failed to send message', 'error');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        let type: any = null;

        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) type = 'image';
        else if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) type = 'audio';
        else if (['mp4', 'mov', 'webm', 'avi'].includes(extension)) type = 'video';
        else type = 'file';

        setSelectedFile(file);
        setFileType(type);
        setPreviewUrl(URL.createObjectURL(file));
        setPreviewName(file.name);
        setPreviewType(type);
    };

    const handleAttachClick = () => fileInputRef.current?.click();

    const handlePreviewClick = (type: any, url: string, name?: string) => {
        setModalPreviewType(type);
        setModalPreviewUrl(url);
        setModalPreviewName(name);
    };

    const handleReplyClick = (message: ChatMessage) => {
        setReplyTo(message);
    };

    const handleCancelReply = () => {
        setReplyTo(null);
    };

    // Small helper for preview text in the reply bar
    const getReplyPreviewText = (msg: ChatMessage | null): string => {
        if (!msg) return '';
        if (typeof msg.content === 'string') return msg.content;

        const doc: any = msg.content;
        const firstBlock = doc?.content?.[0];
        const firstChild = firstBlock?.content?.[0];
        return firstChild?.text || '';
    };

    return (
        <div className="container p-0 pt-md-2 my-0">
            <Card className="shadow p-2 p-lg-3 chat-container no_srollbar">
                <div className="botones chat-container-color px-2 d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center text-center mb-3">
                    <div className="d-flex align-items-center justify-content-center my-2">
                        <h3 className="mb-1">💬 Chat de Grupo</h3>
                        <ChatDirectory allUsers={allUsers} onlineUsers={onlineUsers} />
                    </div>
                    <Link
                        to="/admin"
                        className="d-none d-md-block btn general_btn fw-bolder px-3 m-2"
                    >
                        Ir al Inicio
                    </Link>
                </div>

                <ChatBubbleContainer
                    messages={messages}
                    messagesContainerRef={messagesContainerRef}
                    isLoadingMore={isLoadingMore}
                    hasMoreMessages={hasMoreMessages}
                    isOwnMessage={isOwnMessage}
                    onImageClick={setExpandedImage}
                    onPreviewClick={handlePreviewClick}
                    onReply={handleReplyClick}
                />

                {replyTo && (
                    <div className="d-flex align-items-center justify-content-between mx-3 mt-1 mb-2 px-3 py-2 rounded bg-light border small">
                        <div className="me-2 text-truncate">
                            <div className="fw-semibold">
                                Respondiendo a{' '}
                                {replyTo.author?.name || replyTo.author?.username || replyTo.author?.id}
                            </div>
                            <div className="text-muted text-truncate" style={{ maxWidth: '100%' }}>
                                {getReplyPreviewText(replyTo)}
                            </div>
                        </div>
                        <Button
                            variant="link"
                            className="text-muted p-0 ms-2"
                            onClick={handleCancelReply}
                        >
                            ✕
                        </Button>
                    </div>
                )}

                <div className="d-flex flex-row align-items-end gap-3 ms-3 mt-1 mb-1">
                    <ChatPreviewContainer
                        previewType={previewType}
                        previewUrl={previewUrl}
                        previewName={previewName}
                        loading={isSending}
                        onPreviewClick={handlePreviewClick}
                        onImageClick={setExpandedImage}
                    />
                </div>

                <ChatInputArea
                    messageContent={messageContent}
                    setMessageContent={setMessageContent}
                    onFileSelect={handleFileSelect}
                    onSend={handleSendMessage}
                    fileInputRef={fileInputRef}
                    onAttachClick={handleAttachClick}
                    editorRef={editorRef}
                    loading={isSending}
                />
            </Card>

            <ChatImageModal imageUrl={expandedImage} onClose={() => setExpandedImage(null)} />
            <ChatFilePreviewModal
                type={modalPreviewType}
                fileUrl={modalPreviewUrl}
                fileName={modalPreviewName}
                onClose={() => setModalPreviewUrl(null)}
            />
        </div>
    );
};
