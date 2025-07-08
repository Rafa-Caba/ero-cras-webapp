// stores/useUsuariosStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    buscarUsuarios
} from '../../services/usuarios';
import type { Usuario } from '../../types';

interface UsuariosState {
    usuarios: Usuario[];
    usuarioSeleccionado: Usuario | null;
    cargando: boolean;
    error: string | null;
    paginaActual: number;
    totalPaginas: number;
    totalUsuarios: number;

    // Acciones
    fetchUsuarios: (pagina?: number, limite?: number) => Promise<void>;
    fetchUsuarioPorId: (id: string) => Promise<Usuario>;
    crearNuevoUsuario: (formData: FormData) => Promise<void>;
    actualizarUsuarioExistente: (id: string, formData: FormData) => Promise<void>;
    eliminarUsuarioPorId: (id: string) => Promise<void>;
    buscarUsuariosPorTexto: (q: string) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
}

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

            setPaginaActual: (pagina) => set({ paginaActual: pagina }),
        }),
        {
            name: 'usuarios-store', // clave para localStorage
        }
    )
);
