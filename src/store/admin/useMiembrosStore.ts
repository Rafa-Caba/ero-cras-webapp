import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    obtenerMiembros,
    obtenerMiembroPorId,
    crearMiembro,
    actualizarMiembro,
    eliminarMiembro,
    buscarMiembros
} from '../../services/miembros';
import type { Miembro } from '../../types/miembros';

interface MiembrosState {
    miembros: Miembro[];
    miembroSeleccionado: Miembro | null;
    cargando: boolean;
    error: string | null;
    paginaActual: number;
    totalPaginas: number;
    totalMiembros: number;

    // Acciones
    fetchMiembros: (pagina?: number, limite?: number) => Promise<void>;
    fetchMiembroPorId: (id: string) => Promise<Miembro>;
    crearNuevoMiembro: (formData: FormData) => Promise<void>;
    actualizarMiembroExistente: (id: string, formData: FormData) => Promise<void>;
    eliminarMiembroPorId: (id: string) => Promise<void>;
    buscarMiembrosPorTexto: (q: string) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
}

export const useMiembrosStore = create<MiembrosState>()(
    persist(
        (set) => ({
            miembros: [],
            miembroSeleccionado: null,
            paginaActual: 1,
            totalPaginas: 1,
            totalMiembros: 0,
            cargando: false,
            error: null,

            fetchMiembros: async (pagina = 1) => {
                try {
                    set({ cargando: true, error: null });
                    const data = await obtenerMiembros(pagina);
                    set({
                        miembros: data.miembros,
                        paginaActual: data.paginaActual,
                        totalPaginas: data.totalPaginas,
                        cargando: false
                    });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            fetchMiembroPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    const miembro = await obtenerMiembroPorId(id);
                    set({ miembroSeleccionado: miembro, cargando: false });
                    return miembro;
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            crearNuevoMiembro: async (formData) => {
                try {
                    set({ cargando: true, error: null });
                    await crearMiembro(formData);
                    const { miembros: miembrosActualizados } = await obtenerMiembros();
                    set({ miembros: miembrosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            actualizarMiembroExistente: async (id, formData) => {
                try {
                    set({ cargando: true, error: null });
                    await actualizarMiembro(id, formData);
                    const { miembros: miembrosActualizados } = await obtenerMiembros();
                    set({ miembros: miembrosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            eliminarMiembroPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    await eliminarMiembro(id);
                    const { miembros: miembrosActualizados } = await obtenerMiembros();
                    set({ miembros: miembrosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            buscarMiembrosPorTexto: async (q) => {
                try {
                    set({ cargando: true, error: null });
                    const resultados = await buscarMiembros(q);
                    set({ miembros: resultados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            setPaginaActual: (pagina) => set({ paginaActual: pagina }),
        }),
        {
            name: 'miembros-store', // para persistencia local
        }
    )
);
