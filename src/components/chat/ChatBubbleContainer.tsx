// Corregido el tipo para aceptar HTMLDivElement | null en la ref
import { Spinner } from 'react-bootstrap';
import { AdminChatBubbles } from './AdminChatBubbles';
import type { ChatMessage } from '../../types';
import { obtenerEtiquetaFecha } from '../../utils/chat/obtenerEtiquetaFecha';

interface Props {
    mensajes: ChatMessage[];
    mensajesContainerRef: React.RefObject<HTMLDivElement | null>; // Aceptamos null
    cargandoMas: boolean;
    noHayMasMensajes: boolean;
    esMensajePropio: (autorId: string) => boolean;
    setImagenAmpliada: (url: string | null) => void;
    onPreviewClick: (tipo: 'imagen' | 'archivo' | 'media', url: string, nombre?: string) => void;
}

export const ChatBubbleContainer = ({
    mensajes,
    mensajesContainerRef,
    cargandoMas,
    noHayMasMensajes,
    esMensajePropio,
    setImagenAmpliada,
    onPreviewClick
}: Props) => {
    const mensajesAgrupados = mensajes.reduce((acc, mensaje) => {
        const etiqueta = obtenerEtiquetaFecha(mensaje.createdAt);
        if (!acc[etiqueta]) acc[etiqueta] = [];
        acc[etiqueta].push(mensaje);
        return acc;
    }, {} as Record<string, ChatMessage[]>);

    return (
        <div
            ref={mensajesContainerRef as React.RefObject<HTMLDivElement>}
            className="
                chat-mensajes-container chat-scroll-container no_scrollbar chat-container-color 
                rounded p-2 p-md-3 mb-1 mb-lg-2 border overflow-y-auto
            "
            style={{
                minHeight: '400px',
                maxHeight: '62vh', 
                overflowY: 'auto', 
            }}
        >
            {noHayMasMensajes && (
                <p className="text-center text-theme-color small">No more messages to load.</p>
            )}
            {cargandoMas && (
                <div className="text-center text-theme-color small mb-2">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Cargando mensajes anteriores...
                </div>
            )}

            <AdminChatBubbles
                mensajesAgrupados={mensajesAgrupados}
                esMensajePropio={esMensajePropio}
                setImagenAmpliada={setImagenAmpliada}
                onPreviewClick={onPreviewClick}
            />
        </div>
    );
};
