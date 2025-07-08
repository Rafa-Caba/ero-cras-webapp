import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    obtenerAvisos,
    obtenerAvisoPorId,
    crearAviso,
    actualizarAviso,
    eliminarAviso,
    buscarAvisos
} from '../../services/avisos';
import type { Aviso } from '../../types';

interface AvisosState {
    avisos: Aviso[];
    avisoSeleccionado: Aviso | null;
    cargando: boolean;
    error: string | null;
    paginaActual: number;
    totalPaginas: number;
    totalAvisos: number;

    fetchAvisos: (pagina?: number, limite?: number) => Promise<void>;
    fetchAvisoPorId: (id: string) => Promise<Aviso>;
    crearNuevoAviso: (formData: FormData) => Promise<void>;
    actualizarAvisoExistente: (id: string, formData: FormData) => Promise<void>;
    eliminarAvisoPorId: (id: string) => Promise<void>;
    buscarAvisosPorTexto: (q: string) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
}

export const useAvisosStore = create<AvisosState>()(
    persist(
        (set) => ({
            avisos: [],
            avisoSeleccionado: null,
            paginaActual: 1,
            totalPaginas: 1,
            totalAvisos: 0,
            cargando: false,
            error: null,

            fetchAvisos: async (pagina = 1) => {
                try {
                    set({ cargando: true, error: null });
                    const data = await obtenerAvisos(pagina);
                    set({
                        avisos: data.avisos,
                        paginaActual: data.paginaActual,
                        totalPaginas: data.totalPaginas,
                        totalAvisos: data.totalAvisos,
                        cargando: false
                    });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            fetchAvisoPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    const aviso = await obtenerAvisoPorId(id);
                    set({ avisoSeleccionado: aviso, cargando: false });
                    return aviso;
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            crearNuevoAviso: async (formData) => {
                try {
                    set({ cargando: true, error: null });
                    await crearAviso(formData);
                    const { avisos: avisosActualizados } = await obtenerAvisos();
                    set({ avisos: avisosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            actualizarAvisoExistente: async (id, formData) => {
                try {
                    set({ cargando: true, error: null });
                    await actualizarAviso(id, formData);
                    const { avisos: avisosActualizados } = await obtenerAvisos();
                    set({ avisos: avisosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            eliminarAvisoPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    await eliminarAviso(id);
                    const { avisos: avisosActualizados } = await obtenerAvisos();
                    set({ avisos: avisosActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            buscarAvisosPorTexto: async (q) => {
                try {
                    set({ cargando: true, error: null });
                    const resultados = await buscarAvisos(q);
                    set({ avisos: resultados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            setPaginaActual: (pagina) => set({ paginaActual: pagina }),
        }),
        {
            name: 'avisos-store',
        }
    )
);
