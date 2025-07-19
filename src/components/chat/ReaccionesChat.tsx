// components/chat/ReaccionesChat.tsx
import { useAuth } from '../../hooks/useAuth';
import { useChatStore } from '../../store/admin/useChatStore';
import { Button } from 'react-bootstrap';

interface Reaccion {
    emoji: string;
    usuario: string;
}

interface ReaccionesChatProps {
    mensajeId: string;
    reacciones: Reaccion[];
}

export const ReaccionesChat = ({ mensajeId, reacciones }: ReaccionesChatProps) => {
    const { user } = useAuth();
    const reaccionar = useChatStore((state) => state.reaccionarAMensajeEnStore);

    const handleReaccionClick = async (emoji: string) => {
        if (!user?._id) return;
        await reaccionar(mensajeId, emoji);
    };

    const agrupadas = reacciones.reduce<Record<string, string[]>>((acc, reaccion) => {
        acc[reaccion.emoji] = acc[reaccion.emoji] || [];
        acc[reaccion.emoji].push(reaccion.usuario);
        return acc;
    }, {});

    return (
        <div className="d-flex gap-2 mt-1 flex-wrap">
            {Object.entries(agrupadas).map(([emoji, usuarios]) => {
                const yaReacciono = usuarios.includes(user?._id || '');
                return (
                    <Button
                        key={emoji}
                        size="sm"
                        variant={yaReacciono ? 'secondary' : 'outline-secondary'}
                        className="rounded-pill py-1 px-2 d-flex align-items-center"
                        onClick={() => handleReaccionClick(emoji)}
                        title={usuarios.length > 1 ? `${usuarios.length} reacciones` : '1 reacción'}
                    >
                        <span className="me-1">{emoji}</span>
                        <small>{usuarios.length}</small>
                    </Button>
                );
            })}
        </div>
    );
};
