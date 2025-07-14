import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    activarThemeGroup,
    actualizarThemeGroup,
    crearThemeGroup,
    eliminarThemeGroup,
    obtenerGrupoActivo,
    obtenerThemeGroupPorId,
    obtenerThemeGroups
} from '../../services/themeGroups';
import type { ThemeGroupsState, ThemeGroup, ThemeGroupForm } from '../../types';

export const useThemeGroupsStore = create<ThemeGroupsState>()(
    persist(
        (set) => ({
            grupos: [],
            grupoSeleccionado: null,
            temaActivo: null,
            paginaActual: 1,
            totalPaginas: 1,
            totalGrupos: 0,
            cargando: false,
            error: null,

            fetchGrupos: async (pagina = 1) => {
                try {
                    set({ cargando: true, error: null });
                    const data = await obtenerThemeGroups(pagina);
                    set({
                        grupos: data.grupos,
                        paginaActual: data.paginaActual,
                        totalPaginas: data.totalPaginas,
                        totalGrupos: data.totalGrupos ?? data.grupos.length,
                        cargando: false
                    });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            fetchGrupoPorId: async (id: string): Promise<ThemeGroup> => {
                try {
                    set({ cargando: true, error: null });
                    const grupo = await obtenerThemeGroupPorId(id);
                    set({ grupoSeleccionado: grupo, cargando: false });
                    return grupo;
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            createNuevoGrupo: async (data: ThemeGroupForm) => {
                try {
                    set({ cargando: true, error: null });
                    await crearThemeGroup(data);
                    const { grupos: gruposActualizados } = await obtenerThemeGroups();
                    set({ grupos: gruposActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            actualizarGrupoExistente: async (id: string, data: ThemeGroupForm) => {
                try {
                    set({ cargando: true, error: null });
                    await actualizarThemeGroup(id, data);
                    const { grupos: gruposActualizados } = await obtenerThemeGroups();
                    set({ grupos: gruposActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            eliminarGrupoPorId: async (id: string) => {
                try {
                    set({ cargando: true, error: null });
                    await eliminarThemeGroup(id);
                    const { grupos: gruposActualizados } = await obtenerThemeGroups();
                    set({ grupos: gruposActualizados, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            setPaginaActual: (pagina: number) => set({ paginaActual: pagina }),

            setTemaActivo: (grupo) => {
                localStorage.setItem('tema-admin', JSON.stringify(grupo));
                set({ temaActivo: grupo });
            },

            activarGrupo: async (id: string) => {
                try {
                    set({ cargando: true, error: null });
                    await activarThemeGroup(id); // llamada al service
                    const actualizado = await obtenerThemeGroupPorId(id);
                    set({ temaActivo: actualizado });

                    // refresca lista y guarda opcionalmente en localStorage
                    const { grupos } = await obtenerThemeGroups();
                    set({ grupos, cargando: false });
                    localStorage.setItem('tema-admin', JSON.stringify(actualizado));
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            fetchTemaActivo: async () => {
                try {
                    const activo = await obtenerGrupoActivo();
                    if (activo) {
                        set({ temaActivo: activo });
                        localStorage.setItem('tema-admin', JSON.stringify(activo));
                    }
                } catch (error: any) {
                    console.warn('No se pudo obtener el tema activo');
                }
            },
        }),
        {
            name: 'theme-groups-store',
        }
    )
);
