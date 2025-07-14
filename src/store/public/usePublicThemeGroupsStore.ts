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

            // Por default el primero será el activo
            set({
                themeGroups: grupos,
                temaActivo: grupos.length > 0 ? grupos[0] : null,
                cargando: false
            });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    },

    fetchGrupoActivoPublico: async () => {
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
