import { useEffect, useRef, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { JSONContent } from '@tiptap/react';
import { useChatStore } from '../../store/admin/useChatStore';
import { useAuth } from '../../hooks/useAuth';
import type { ChatMessage, NuevoMensaje } from '../../types';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { ChatImageModal } from './index';
import { socket } from '../../services/socket';
import { scrollChatToBottom } from '../../utils';
import { ChatFilePreviewModal } from './ChatFilePreviewModal';
import { ChatBubbleContainer } from './ChatBubbleContainer';
import { ChatPreviewContainer } from './ChatPreviewContainer';
import { ChatInputArea } from './ChatInputArea';
import Swal from 'sweetalert2';

export const AdminChatGroup = () => {
    const { user } = useAuth();

    const {
        mensajes,
        noHayMasMensajes,
        fetchMensajes,
        agregarMensajeArchivo,
        agregarMensajeSocket,
        agregarMensajeTexto,
        fetchMensajesAnteriores,
        actualizarMensajeReaccion,
        agregarArchivoGeneral,
        agregarArchivoMedia,
        cargando,
    } = useChatStore();

    const [mensaje, setMensaje] = useState<JSONContent>(emptyEditorContent);
    const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);
    const [cargandoMas, setCargandoMas] = useState(false);

    const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null);
    const [archivoTipo, setArchivoTipo] = useState<'imagen' | 'archivo' | 'media' | null>(null);

    const [previewTipo, setPreviewTipo] = useState<'imagen' | 'archivo' | 'media' | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewNombre, setPreviewNombre] = useState<string | undefined>();

    const [previewMensajeTipo, setPreviewMensajeTipo] = useState<'imagen' | 'archivo' | 'media' | null>(null);
    const [previewMensajeUrl, setPreviewMensajeUrl] = useState<string | null>(null);
    const [previewMensajeNombre, setPreviewMensajeNombre] = useState<string | undefined>();

    const editorRef = useRef<{ clear: () => void }>(null);
    const mensajesContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMensajes();
    }, []);

    useEffect(() => {
        if (mensajes.length >= 5) {
            scrollChatToBottom(mensajesContainerRef.current);
        }
    }, [mensajes]);

    useEffect(() => {
        const container = mensajesContainerRef.current;
        if (!container) return;

        const handleScroll = async () => {
            if (container.scrollTop === 0 && !cargandoMas && !noHayMasMensajes) {
                setCargandoMas(true);
                const scrollAlturaAntes = container.scrollHeight;

                await fetchMensajesAnteriores();

                requestAnimationFrame(() => {
                    const scrollAlturaDespues = container.scrollHeight;
                    const diferencia = scrollAlturaDespues - scrollAlturaAntes;
                    container.scrollTop = diferencia;
                    setCargandoMas(false);
                });
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [fetchMensajesAnteriores, cargandoMas]);

    useEffect(() => {
        const handler = (nuevoMensaje: ChatMessage) => {
            agregarMensajeSocket(nuevoMensaje);
        };

        socket.on('nuevo-mensaje', handler);

        return () => {
            socket.off('nuevo-mensaje', handler);
        };
    }, []);

    useEffect(() => {
        const handler = (mensajeActualizado: ChatMessage) => {
            actualizarMensajeReaccion(mensajeActualizado);

            const tieneContenido =
                mensajeActualizado.contenido?.content?.length ||
                mensajeActualizado.archivoUrl ||
                mensajeActualizado.imagenUrl;

            if (!tieneContenido) return;

            scrollChatToBottom(mensajesContainerRef.current);
        };

        socket.on('mensaje-actualizado', handler);

        return () => {
            socket.off('mensaje-actualizado', handler);
        };
    }, []);

    const enviarMensaje = async () => {
        if ((!mensaje || !mensaje.content?.length) && !archivoSeleccionado) return;
        if (!user) return;

        const formData = new FormData();
        formData.append('autor', user._id);
        formData.append('creadoPor', user._id);

        try {
            if (archivoSeleccionado) {
                if (archivoTipo === 'imagen') {
                    formData.append('imagen', archivoSeleccionado);
                    formData.append('contenido', JSON.stringify(mensaje));
                    await agregarMensajeArchivo(formData);
                } else if (archivoTipo === 'archivo') {
                    formData.append('archivo', archivoSeleccionado);
                    await agregarArchivoGeneral(formData);
                } else if (archivoTipo === 'media') {
                    formData.append('media', archivoSeleccionado);
                    await agregarArchivoMedia(formData);
                }
            } else {
                const nuevoMensaje: NuevoMensaje = {
                    autor: user,
                    contenido: mensaje,
                    tipo: 'texto',
                };
                await agregarMensajeTexto(nuevoMensaje);
            }

            editorRef.current?.clear();
            setMensaje(emptyEditorContent);
            setArchivoSeleccionado(null);
            setArchivoTipo(null);
            setPreviewUrl(null);
            setPreviewNombre(undefined);
            setPreviewTipo(null);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    };

    const esMensajePropio = (autorId: string) => autorId === user?._id;

    const handleArchivoSeleccionado = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const extension = file.name.split('.').pop()?.toLowerCase() || '';
        const extensionesImagen = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const extensionesArchivo = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'txt', 'zip', 'rar'];
        const extensionesMedia = ['mp3', 'wav', 'mp4', 'mov', 'webm'];

        let tipo: 'imagen' | 'archivo' | 'media' | null = null;

        if (extensionesImagen.includes(extension)) tipo = 'imagen';
        else if (extensionesArchivo.includes(extension)) tipo = 'archivo';
        else if (extensionesMedia.includes(extension)) tipo = 'media';
        else {
            Swal.fire('Alerta!', 'Tipo de archivo no soportado.', 'error');
            return;
        }

        setArchivoSeleccionado(file);
        setArchivoTipo(tipo);
        setPreviewUrl(URL.createObjectURL(file));
        setPreviewNombre(file.name);
        setPreviewTipo(tipo);
    };

    const handleClickAdjuntar = (e?: React.MouseEvent) => {
        if (e?.defaultPrevented) return;

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
        }
    };

    const handlePreviewClick = (tipo: 'imagen' | 'archivo' | 'media', url: string, nombre?: string) => {
        setPreviewMensajeTipo(tipo);
        setPreviewMensajeUrl(url);
        setPreviewMensajeNombre(nombre);
    };

    return (
        <div className="container p-0 pt-md-2 my-0">
            <Card className="shadow p-2 p-lg-3 chat-container no_srollbar">
                <div className="botones chat-container-color px-2 d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center text-center mb-3">
                    <h3 className="mb-1">💬 Chat de Grupo</h3>
                    <Link to="/admin" className="btn general_btn fw-bolder px-3 m-2">Ir al Inicio</Link>
                </div>

                <ChatBubbleContainer
                    mensajes={mensajes}
                    mensajesContainerRef={mensajesContainerRef}
                    cargandoMas={cargandoMas}
                    noHayMasMensajes={noHayMasMensajes}
                    esMensajePropio={esMensajePropio}
                    setImagenAmpliada={setImagenAmpliada}
                    onPreviewClick={handlePreviewClick}
                />

                <div className='d-flex flex-row align-items-end gap-3 ms-3 mt-1 mb-1'>
                    <ChatPreviewContainer
                        previewTipo={previewTipo}
                        previewUrl={previewUrl}
                        previewNombre={previewNombre}
                        cargando={cargando}
                        onPreviewClick={handlePreviewClick}
                        onImagenClick={setImagenAmpliada}
                    />
                </div>

                <ChatInputArea
                    mensaje={mensaje}
                    setMensaje={setMensaje}
                    onFileSelect={handleArchivoSeleccionado}
                    onSend={enviarMensaje}
                    fileInputRef={fileInputRef}
                    onClickAdjuntar={handleClickAdjuntar}
                    editorRef={editorRef}
                    cargando={cargando}
                />
            </Card>

            <ChatImageModal imagenUrl={imagenAmpliada} onClose={() => setImagenAmpliada(null)} />

            <ChatFilePreviewModal
                tipo={previewMensajeTipo}
                archivoUrl={previewMensajeUrl}
                archivoNombre={previewMensajeNombre}
                onClose={() => {
                    setPreviewMensajeTipo(null);
                    setPreviewMensajeUrl(null);
                    setPreviewMensajeNombre(undefined);
                }}
            />

        </div>
    );
};
