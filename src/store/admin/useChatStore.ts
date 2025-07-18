import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatState } from '../../types';
import {
    obtenerMensajesChat,
    enviarMensajeTexto,
    enviarMensajeArchivo,
    subirImagenChat
} from '../../services/chat';

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            mensajes: [],
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

            limpiarMensajes: () => set({ mensajes: [] })
        }),
        {
            name: 'chat-store'
        }
    )
);


// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import type { ChatState } from '../../types';
// import {
//     obtenerMensajesChat,
//     enviarMensajeTexto,
//     enviarMensajeArchivo
// } from '../../services/chat';

// export const useChatStore = create<ChatState>()(
//     persist(
//         (set, get) => ({
//             mensajes: [],
//             cargando: false,
//             error: null,

//             fetchMensajes: async () => {
//                 try {
//                     set({ cargando: true, error: null });
//                     const mensajes = await obtenerMensajesChat();
//                     set({ mensajes, cargando: false });
//                 } catch (error: any) {
//                     set({ error: error.message, cargando: false });
//                 }
//             },

//             agregarMensajeTexto: async (nuevoMensaje) => {
//                 const { mensaje } = await enviarMensajeTexto(nuevoMensaje);
//                 set((state) => ({
//                     mensajes: [...state.mensajes, mensaje],
//                 }));
//             },

//             agregarMensajeArchivo: async (formData) => {
//                 try {
//                     set({ cargando: true, error: null });
//                     await enviarMensajeArchivo(formData);
//                     const mensajes = await obtenerMensajesChat();
//                     set({ mensajes, cargando: false });
//                 } catch (error: any) {
//                     set({ error: error.message, cargando: false });
//                 }
//             },

//             agregarMensajeSocket: (mensaje) => {
//                 set({ mensajes: [...get().mensajes, mensaje] });
//             },

//             limpiarMensajes: () => set({ mensajes: [] })
//         }),
//         {
//             name: 'chat-store'
//         }
//     )
// );
