import { create } from 'zustand';
import { obtenerMiembrosPublicos } from '../../services/miembros';
import type { Miembro } from '../../types/miembros';

interface PublicMiembrosState {
    miembros: Miembro[];
    cargando: boolean;
    error: string | null;
    totalMiembros: number;

    fetchMiembrosPublicos: () => Promise<void>;
}

export const usePublicMiembrosStore = create<PublicMiembrosState>((set) => ({
    miembros: [],
    cargando: false,
    error: null,
    totalMiembros: 0,

    fetchMiembrosPublicos: async () => {
        try {
            set({ cargando: true, error: null });
            const miembros = await obtenerMiembrosPublicos();
            set({
                miembros: Array.isArray(miembros) ? miembros : Object.values(miembros),
                cargando: false
            });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    }
}));
