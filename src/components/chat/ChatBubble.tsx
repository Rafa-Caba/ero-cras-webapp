import { Figure, Button } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../../types';
import { TiptapChatViewer } from '../tiptap-components/TiptapChatViewer';

interface Props {
    msg: ChatMessage;
    anterior?: ChatMessage;
    esPropio: boolean;
    onImagenClick: (url: string) => void;
    onAvatarClick: (url: string) => void;
}

export const ChatBubble = ({ msg, anterior, esPropio, onImagenClick, onAvatarClick }: Props) => {
    const esMismoAutor = anterior && anterior.autor._id === msg.autor._id;

    return (
        <div className={`d-flex mb-1 ${esPropio ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`flex items-end gap-2 rounded ${esPropio ? 'flex-row-reverse' : ''}`}>
                <div className='d-flex flex-row mb-3 gap-2'>
                    <Button
                        variant="link"
                        className={`p-0 border-0 align-self-start ${esPropio ? 'order-2' : 'order-1'}`}
                        onClick={() => onAvatarClick(msg.autor.fotoPerfilUrl!)}
                    >
                        <img
                            src={msg.autor.fotoPerfilUrl || '/images/default-user.png'}
                            height={45}
                            alt={msg.autor.nombre}
                            className="w-8 h-8 circled shadow"
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
                            className={`
                p-3 max-w-[75%] transition-all duration-200 shadow-md rounded
                ${esPropio ? 'text-end chat_sender' : 'text-start chat_receiver'}
              `}
                        >
                            {!esMismoAutor && (
                                <div className="text-xs text-gray-500 mb-1 fw-bold">
                                    {msg.autor.nombre} (@{msg.autor.username})
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
                            </div>

                            <div className="text-[10px] text-gray-400 text-right mt-1">
                                {format(parseISO(msg.createdAt), 'HH:mm', { locale: es })} hrs
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
