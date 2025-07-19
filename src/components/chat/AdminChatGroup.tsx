import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, Figure, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { JSONContent } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { useChatStore } from '../../store/admin/useChatStore';
import { useAuth } from '../../hooks/useAuth';
import type { ChatMessage, NuevoMensaje } from '../../types';
import { obtenerEtiquetaFecha } from '../../utils/chat/obtenerEtiquetaFecha';
import { TiptapChatEditor } from '../tiptap-components/TiptapChatEditor';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { AdminChatBubbles, ChatImageModal } from './index';
import { socket } from '../../services/socket';
import { scrollChatToBottom } from '../../utils';

export const AdminChatGroup = () => {
    // socket.on('connect', () => {
    //     console.log('🟢 Socket conectado con ID:', socket.id);
    // });

    // socket.on('disconnect', () => {
    //     console.log('🔴 Socket desconectado');
    // });
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
        cargando,
    } = useChatStore();

    const [mensaje, setMensaje] = useState<JSONContent>(emptyEditorContent);
    const [imagen, setImagen] = useState<File | null>(null);
    const [imagenPreview, setImagenPreview] = useState<string | null>(null);
    const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);
    const [cargandoMas, setCargandoMas] = useState(false);

    const editorRef = useRef<{ clear: () => void }>(null);
    const mensajesContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMensajes();
    }, []);

    useEffect(() => {
        if (mensajes.length === 0) return;

        // Solo hacer scroll automático si hay más de 5 mensajes
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
            // console.log('📥 Socket recibido:', nuevoMensaje);
            agregarMensajeSocket(nuevoMensaje);
        };

        socket.on('nuevo-mensaje', handler);

        return () => {
            socket.off('nuevo-mensaje', handler); // 👈 asegúrate de usar el mismo nombre
        };
    }, []);

    useEffect(() => {
        const handler = (mensajeActualizado: ChatMessage) => {
            actualizarMensajeReaccion(mensajeActualizado);

            // ⚠️ Detectar si el mensaje tiene contenido nuevo o solo es una reacción
            const tieneContenido =
                mensajeActualizado.contenido?.content?.length ||
                mensajeActualizado.archivoUrl ||
                mensajeActualizado.imagenUrl;

            if (!tieneContenido) return; // 🧠 si no hay contenido ni archivos, fue solo una reacción

            scrollChatToBottom(mensajesContainerRef.current);
        };

        socket.on('mensaje-actualizado', handler);

        return () => {
            socket.off('mensaje-actualizado', handler); // ✅ función de cleanup válida
        };
    }, []);

    const enviarMensaje = async () => {
        if ((!mensaje || !mensaje.content?.length) && !imagen) return;
        if (!user) return;

        if (imagen) {
            const formData = new FormData();
            formData.append('imagen', imagen);
            formData.append('contenido', JSON.stringify(mensaje));
            formData.append('autor', user._id);

            try {
                await agregarMensajeArchivo(formData);
                await fetchMensajes();
            } catch (error) {
                console.error('Error enviando imagen del chat:', error);
            }
        } else {
            const nuevoMensaje: NuevoMensaje = {
                autor: user,
                contenido: mensaje,
                tipo: 'texto',
            };

            try {
                await agregarMensajeTexto(nuevoMensaje);
            } catch (error) {
                console.error('Error al enviar mensaje de texto:', error);
            }
        }

        // Limpieza visual
        editorRef.current?.clear();
        setMensaje(emptyEditorContent);
        setImagen(null);
        setImagenPreview(null);
    };

    const esMensajePropio = (autorId: string) => autorId === user?._id;

    const mensajesAgrupados = mensajes.reduce((acc, mensaje) => {
        const etiqueta = obtenerEtiquetaFecha(mensaje.createdAt);
        if (!acc[etiqueta]) acc[etiqueta] = [];
        acc[etiqueta].push(mensaje);
        return acc;
    }, {} as Record<string, ChatMessage[]>);

    const handleImagenSeleccionada = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImagen(file);
            setImagenPreview(URL.createObjectURL(file)); // para mostrar la preview
        }
    };

    const handleClickAdjuntar = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // 🧼 Limpiar valor previo
            fileInputRef.current.click();   // 📂 Forzar click
        }
    };

    return (
        <div className="container p-0 pt-md-2 my-0">
            <Card className="shadow p-2 p-lg-3 chat-container">
                <div className="botones chat-container-color px-2 d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center text-center mb-3">
                    <h3 className="mb-1">💬 Chat de Grupo</h3>
                    <Link to="/admin" className="btn general_btn fw-bolder px-3 m-2">Ir al Inicio</Link>
                </div>

                <div
                    ref={mensajesContainerRef}
                    className="chat-mensajes-container chat-scroll-container no_scrollbar chat-container-color rounded p-2 p-md-3 mb-1 mb-lg-2 border overflow-y-auto
                                min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px]
                                max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] lg:max-h-[55vh]"

                >
                    {/* Spinner arriba mientras se cargan más mensajes */}
                    {noHayMasMensajes && (
                        <p className="text-center text-theme-color small">No more messages to load.</p>
                    )}
                    {cargandoMas && (
                        <div className="text-center text-theme-color small mb-2">
                            <Spinner animation="border" size="sm" className="me-2" />
                            Cargando mensajes anteriores...
                        </div>
                    )}
                    {<AdminChatBubbles
                        mensajesAgrupados={mensajesAgrupados}
                        esMensajePropio={esMensajePropio}
                        setImagenAmpliada={setImagenAmpliada}
                    />}
                </div>

                <div className='d-flex flex-row align-items-end gap-3 ms-3 mt-1 mb-1'>
                    {/* Preview de imagen seleccionada */}
                    {imagenPreview && (
                        <Button
                            variant="link"
                            className='m-0 p-0 text-start'
                            onClick={() => setImagenAmpliada(imagenPreview!)}
                        >
                            <Figure className='mb-0'>
                                <Figure.Caption className="mb-1">Imagen seleccionada:</Figure.Caption>
                                <Figure.Image
                                    width={80}
                                    alt="preview"
                                    src={imagenPreview}
                                    className="rounded shadow-sm"
                                />
                            </Figure>
                        </Button>
                    )}
                    {cargando && (
                        <div className="text-center my-2">
                            <Spinner animation="border" />
                        </div>
                    )}
                </div>

                <div className="max-h-[150px] overflow-y-auto px-2 py-1 rounded bg-white border border-gray-300 chat-container-color-textarea">
                    <TiptapChatEditor ref={editorRef} content={mensaje} onChange={setMensaje} />
                </div>

                <div className="d-flex align-items-center justify-content-end gap-2 mt-2 flex-wrap">
                    {/* Botón Adjuntar Imagen */}
                    <Form.Group controlId="chat-file" className="mb-0">
                        <Button variant="secondary" onClick={handleClickAdjuntar}>
                            <FontAwesomeIcon icon={faPaperclip} className="text-white" size="lg" />
                        </Button>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImagenSeleccionada}
                            style={{ display: 'none' }}
                        />
                    </Form.Group>

                    {/* Botón Enviar */}
                    <Button className='general_btn px-4' onClick={enviarMensaje}>
                        Enviar
                    </Button>
                </div>
            </Card>

            <ChatImageModal
                imagenUrl={imagenAmpliada}
                onClose={() => setImagenAmpliada(null)}
            />
        </div>
    );
};
