import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    buscarUsuarios,
    updateTemaPersonal
} from '../../services/usuarios';
import type { Usuario, UsuariosState } from '../../types';

export const useUsuariosStore = create<UsuariosState>()(
    persist(
        (set) => ({
            usuarios: [],
            usuarioSeleccionado: null,
            paginaActual: 1,
            totalPaginas: 1,
            totalUsuarios: 0,
            cargando: false,
            error: null,

            fetchUsuarios: async (pagina = 1) => {
                try {
                    set({ cargando: true, error: null });
                    const data = await obtenerUsuarios(pagina);
                    set({
                        usuarios: data.usuarios,
                        paginaActual: data.paginaActual,
                        totalPaginas: data.totalPaginas,
                        cargando: false
                    });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            fetchUsuarioPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    const usuario = await obtenerUsuarioPorId(id);
                    set({ usuarioSeleccionado: usuario, cargando: false });
                    return usuario; // 👈 devuelve el usuario directamente
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            crearNuevoUsuario: async (formData) => {
                try {
                    set({ cargando: true, error: null });
                    await crearUsuario(formData);
                    const { usuarios: usuariosActualizados } = await obtenerUsuarios();
                    set({ usuarios: usuariosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            actualizarUsuarioExistente: async (id, formData) => {
                try {
                    set({ cargando: true, error: null });
                    await actualizarUsuario(id, formData);
                    const { usuarios: usuariosActualizados } = await obtenerUsuarios();
                    set({ usuarios: usuariosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            eliminarUsuarioPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    await eliminarUsuario(id);
                    const { usuarios: usuariosActualizados } = await obtenerUsuarios();
                    set({ usuarios: usuariosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            buscarUsuariosPorTexto: async (q) => {
                try {
                    set({ cargando: true, error: null });
                    const resultados = await buscarUsuarios(q);
                    set({ usuarios: resultados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            actualizarUsuarioLogueado: async (id, formData) => {
                try {
                    set({ cargando: true, error: null });
                    const res = await actualizarUsuario(id, formData);
                    set({ usuarioSeleccionado: res.usuarioActualizado })
                    return res.usuarioActualizado;
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            actualizarTemaPersonal: async (id: string, themeId: string): Promise<Usuario> => {
                try {
                    const usuarioActualizado = await updateTemaPersonal(id, themeId);
                    set(state => ({
                        usuarioSeleccionado:
                            state.usuarioSeleccionado?._id === id
                                ? usuarioActualizado
                                : state.usuarioSeleccionado
                    }));
                    return usuarioActualizado;
                } catch (error) {
                    console.error("Error actualizando tema personal:", error);
                    throw error; // 👈 para que no rompa la promesa
                }
            },

            setPaginaActual: (pagina) => set({ paginaActual: pagina }),
        }),
        {
            name: 'usuarios-store', // clave para localStorage
        }
    )
);
