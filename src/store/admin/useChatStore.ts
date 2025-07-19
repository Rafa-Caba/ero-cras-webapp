import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, ChatState } from '../../types';
import {
    obtenerMensajesChat,
    enviarMensajeTexto,
    enviarMensajeArchivo,
    subirImagenChat,
    reaccionarAMensaje
} from '../../services/chat';

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            mensajes: [],
            noHayMasMensajes: false,
            cargando: false,
            error: null,

            fetchMensajes: async () => {
                try {
                    set({ cargando: true, error: null });
                    const mensajes = await obtenerMensajesChat();
                    set({ mensajes, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            fetchMensajesAnteriores: async () => {
                const mensajesActuales = get().mensajes;
                const mensajeMasAntiguo = mensajesActuales[0];

                if (!mensajeMasAntiguo) return;

                const mensajesNuevos = await obtenerMensajesChat(50, mensajeMasAntiguo.createdAt);

                // Si ya no hay más mensajes que cargar
                if (mensajesNuevos.length === 0) {
                    set({ noHayMasMensajes: true });
                    return;
                }

                set((state) => ({
                    mensajes: [...mensajesNuevos, ...state.mensajes]
                }));
            },

            agregarMensajeTexto: async (nuevoMensaje) => {
                const { mensaje } = await enviarMensajeTexto(nuevoMensaje);
                return mensaje;
            },

            agregarMensajeArchivo: async (formData) => {
                try {
                    set({ cargando: true, error: null });

                    const { mensaje } = await enviarMensajeArchivo(formData);

                    set({ cargando: false });
                    return mensaje;

                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            subirImagenYObtenerUrl: async (file: File) => {
                try {
                    const data = await subirImagenChat(file);
                    return data; // ✅ cumple con ImagenSubida
                } catch (error: any) {
                    set({ error: error.message });
                    return null;
                }
            },

            agregarMensajeSocket: (mensaje) => {
                set({ mensajes: [...get().mensajes, mensaje] });
            },

            reaccionarAMensajeEnStore: async (mensajeId, emoji) => {
                try {
                    const { mensaje } = await reaccionarAMensaje(mensajeId, emoji);

                    // Actualizar el mensaje con la nueva reacción
                    const mensajesActuales = get().mensajes;

                    const nuevosMensajes = mensajesActuales.map((msg) =>
                        msg._id === mensaje._id ? mensaje : msg
                    );

                    set({ mensajes: nuevosMensajes });

                } catch (error: any) {
                    console.error('Error al reaccionar al mensaje:', error.message);
                    set({ error: error.message });
                }
            },

            actualizarMensajeReaccion: (mensajeActualizado: ChatMessage) => {
                set((state) => ({
                    mensajes: state.mensajes.map((msg) =>
                        msg._id === mensajeActualizado._id ? mensajeActualizado : msg
                    )
                }));
            },

            limpiarMensajes: () => set({ mensajes: [] })
        }),
        {
            name: 'chat-store'
        }
    )
);