import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    buscarLogs,
    obtenerLogs,
    obtenerLogsPorUsuario
} from '../../services/logs';
import type { Log } from '../../types';

interface LogsState {
    logs: Log[];
    logsPorUsuario: Log[];
    cargando: boolean;
    error: string | null;
    paginaActual: number;
    totalPaginas: number;

    fetchLogs: (pagina?: number, filtro?: Record<string, string>) => Promise<void>;
    fetchLogsPorUsuario: (usuarioId: string) => Promise<void>;
    buscarLogsTexto: (query: string) => Promise<void>;
    setPaginaActual: (pagina: number) => void;
}

export const useLogsStore = create<LogsState>()(
    persist(
        (set) => ({
            logs: [],
            logsPorUsuario: [],
            cargando: false,
            error: null,
            paginaActual: 1,
            totalPaginas: 1,

            fetchLogs: async (pagina = 1, filtro = {}) => {
                try {
                    set({ cargando: true, error: null });
                    const res = await obtenerLogs(pagina, filtro);
                    set({
                        logs: res.logs,
                        paginaActual: res.paginaActual,
                        totalPaginas: res.totalPaginas,
                        cargando: false
                    });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            fetchLogsPorUsuario: async (usuarioId) => {
                try {
                    set({ cargando: true, error: null });
                    const resultado = await obtenerLogsPorUsuario(usuarioId);
                    set({ logsPorUsuario: resultado.logs, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            buscarLogsTexto: async (q) => {
                try {
                    set({ cargando: true, error: null });
                    const resultados = await buscarLogs(q);
                    set({ logs: resultados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            setPaginaActual: (pagina) => set({ paginaActual: pagina })
        }),
        {
            name: 'logs-store'
        }
    )
);
