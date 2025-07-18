import type { ChatMessage } from '../../types';
import { ChatBubble } from './index';

interface Props {
    mensajesAgrupados: Record<string, ChatMessage[]>;
    esMensajePropio: (id: string) => boolean;
    setImagenAmpliada: (url: string) => void;
}

export const AdminChatBubbles = ({ mensajesAgrupados, esMensajePropio, setImagenAmpliada }: Props) => {
    const fechas = Object.entries(mensajesAgrupados);

    if (fechas.length === 0) {
        return (
            <div className='d-flex justify-content-center'>
                <p>No hay mensajes</p>
            </div>
        );
    }

    return (
        <>
            {fechas.map(([fecha, msgsDelDia]) => (
                <div key={fecha}>
                    <div className="relative my-3 text-center">
                        <hr className="border-t border-gray-300" />
                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 dark:bg-gray-900 px-3 text-theme-color fw-bold text-sm">
                            {fecha}
                        </span>
                    </div>

                    {msgsDelDia.map((msg, i) => (
                        <ChatBubble
                            key={msg._id}
                            msg={msg}
                            anterior={msgsDelDia[i - 1]}
                            esPropio={esMensajePropio(msg.autor._id)}
                            onImagenClick={setImagenAmpliada}
                            onAvatarClick={setImagenAmpliada}
                        />
                    ))}
                </div>
            ))}
        </>
    );
};
