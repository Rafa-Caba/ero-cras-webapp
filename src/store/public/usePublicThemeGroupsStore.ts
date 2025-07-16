import { create } from 'zustand';
import { obtenerGrupoActivoPublico, obtenerThemeGroupsPublicos } from '../../services/themeGroups';
import type { PublicThemeGroupsState } from '../../types';

export const usePublicThemeGroupsStore = create<PublicThemeGroupsState>((set) => ({
    themeGroups: [],
    temaActivo: null,
    cargando: false,
    error: null,

    fetchThemeGroupsPublicos: async () => {
        try {
            set({ cargando: true, error: null });
            const grupos = await obtenerThemeGroupsPublicos();

            const activo = grupos.find(g => g.esTemaPublico);
            set({
                themeGroups: grupos,
                temaActivo: activo ?? null,
                cargando: false
            });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    },

    fetchTemaActivoPublico: async () => {
        try {
            const activo = await obtenerGrupoActivoPublico();
            if (activo) {
                set({ temaActivo: activo });
            }
        } catch (error: any) {
            console.warn('No se pudo obtener el grupo activo público');
        }
    },

    setTemaActivo: (grupo) => set({ temaActivo: grupo }),
}));
