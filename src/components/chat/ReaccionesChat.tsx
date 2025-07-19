import { useAuth } from '../../hooks/useAuth';
import { useChatStore } from '../../store/admin/useChatStore';
import { ReaccionItem } from './ReaccionItem';

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
                    <ReaccionItem
                        key={emoji}
                        emoji={emoji}
                        cantidad={usuarios.length}
                        yaReacciono={yaReacciono}
                        onClick={() => handleReaccionClick(emoji)}
                        title={usuarios.length > 1 ? `${usuarios.length} reacciones` : '1 reacción'}
                    />
                );
            })}
        </div>
    );
};
