import { useState } from 'react';
import { Figure, Button } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../../types';
import { TiptapChatViewer } from '../tiptap-components/TiptapChatViewer';
import { formatearNombre } from '../../utils';
import { ReaccionesChat } from './ReaccionesChat';
import { useChatStore } from '../../store/admin/useChatStore';
import { EmojiPickerModal } from './EmojiPickerModal';
import { useAuth } from '../../hooks/useAuth';
import { EmojiFloat } from './EmojiFloat';

interface Props {
    msg: ChatMessage;
    anterior?: ChatMessage;
    esPropio: boolean;
    onImagenClick: (url: string) => void;
    onAvatarClick: (url: string) => void;
}

export const ChatBubble = ({ msg, anterior, esPropio, onImagenClick, onAvatarClick }: Props) => {
    const { user } = useAuth();
    const [showEmojiModal, setShowEmojiModal] = useState(false);
    const [emojiFlotante, setEmojiFlotante] = useState<string | null>(null);
    const [mostrarReaccionMovil, setMostrarReaccionMovil] = useState(false);

    const reaccionar = useChatStore((state) => state.reaccionarAMensajeEnStore);

    const yaReacciono = msg.reacciones?.some(r => r.usuario === user?._id);
    const esMismoAutor = anterior && anterior.autor._id === msg.autor._id;

    const handleEmojiSelect = async (emoji: string) => {
        setEmojiFlotante(emoji); // 🎈 lanza el emoji
        await reaccionar(msg._id, emoji);

        // Oculta el emoji después de animarlo
        setTimeout(() => setEmojiFlotante(null), 1200);
    };

    return (
        <div className={`w-75 d-flex mb-1 ${esPropio ? 'justify-content-end ms-auto' : 'justify-content-start me-auto'}`}>
            <div className={`flex items-end gap-2 rounded ${esPropio ? 'flex-row-reverse' : ''}`}>
                <div className='d-flex flex-row mb-3 gap-2'>
                    <Button
                        variant="link"
                        className={`p-0 rounded border-0 align-self-start ${esPropio ? 'order-2' : 'order-1'}`}
                        onClick={() => onAvatarClick(msg.autor.fotoPerfilUrl!)}
                    >
                        <img
                            src={msg.autor.fotoPerfilUrl || '/images/default-user.png'}
                            height={40}
                            width={40}
                            alt={msg.autor.nombre}
                            className="w-8 h-8 mt-1 rounded-circle shadow"
                            style={{ objectFit: 'cover' }}
                        />
                    </Button>

                    <motion.div
                        key={msg._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${esPropio ? 'order-1' : 'order-2'}`}
                    >
                        <div
                            className="position-relative chat-bubble-container"
                            onClick={() => {
                                if (window.innerWidth <= 768) {
                                    setMostrarReaccionMovil(!mostrarReaccionMovil);
                                }
                            }}
                        >
                            <div
                                className={`
                                    p-3 transition-all duration-200 shadow-md rounded
                                    ${esPropio ? 'text-end ms-auto chat_sender' : 'text-start me-auto chat_receiver'}
                                `}
                            >
                                {!esMismoAutor && (
                                    <div className="text-xs text-gray-500 mb-1 fw-bold">
                                        <p className='chat-user-titulo'>{formatearNombre(msg.autor.nombre)}</p>
                                        {/* (@{msg.autor.username}) */}
                                    </div>
                                )}

                                <div className={`mensaje-burbuja ${esPropio ? 'text-end' : 'text-start'}`}>
                                    {msg.tipo === 'imagen' && (
                                        <>
                                            {msg.imagenUrl && (
                                                <Button variant="link" className="p-0 border-0" onClick={() => onImagenClick(msg.imagenUrl!)}>
                                                    <Figure className="mt-2 mb-1">
                                                        <Figure.Image
                                                            width={175}
                                                            alt="Imagen del mensaje"
                                                            src={msg.imagenUrl}
                                                            className="rounded shadow-sm"
                                                            onLoad={() => {
                                                                const chatEnd = document.getElementById('chat-end');
                                                                chatEnd?.scrollIntoView({ behavior: 'smooth' });
                                                            }}
                                                        />
                                                    </Figure>
                                                </Button>
                                            )}
                                            {Array.isArray(msg.contenido?.content) && msg.contenido.content.length > 0 && (
                                                <TiptapChatViewer content={msg.contenido} />
                                            )}
                                        </>
                                    )}

                                    {msg.tipo === 'texto' && (
                                        <TiptapChatViewer content={msg.contenido} />
                                    )}

                                    {msg.reacciones && msg.reacciones.length > 0 && (
                                        <motion.div
                                            className="chat-reacciones"
                                            whileHover={{ scale: 1.30 }}
                                            transition={{ type: 'spring', stiffness: 400 }}
                                        >
                                            <ReaccionesChat mensajeId={msg._id} reacciones={msg.reacciones} />
                                        </motion.div>
                                    )}

                                    {!yaReacciono && (
                                        <Button
                                            size="sm"
                                            variant="light"
                                            className="chat-reaccion-btn"
                                            onClick={() => setShowEmojiModal(true)}
                                            style={{ opacity: mostrarReaccionMovil ? 1 : undefined }}
                                        >
                                            😄
                                        </Button>
                                    )}
                                </div>

                                <div className="text-[10px] text-gray-400 text-right mt-1">
                                    <p className='chat-user-fecha'>
                                        {format(parseISO(msg.createdAt), 'HH:mm', { locale: es })} hrs
                                    </p>
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

            {emojiFlotante && (
                <EmojiFloat emoji={emojiFlotante} side={esPropio ? 'right' : 'left'} />
            )}
        </div>
    );
};
