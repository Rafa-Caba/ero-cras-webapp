import { create } from 'zustand';
import { obtenerCantosPublicos } from '../../services/cantos';
import type { Canto } from '../../types';

interface PublicCantosState {
    cantos: Canto[];
    cargando: boolean;
    error: string | null;
    fetchCantosPublicos: () => Promise<void>;
}

export const usePublicCantosStore = create<PublicCantosState>((set) => ({
    cantos: [],
    cargando: false,
    error: null,

    fetchCantosPublicos: async () => {
        try {
            set({ cargando: true, error: null });
            const cantos = await obtenerCantosPublicos();
            set({ cantos, cargando: false });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    },
}));
