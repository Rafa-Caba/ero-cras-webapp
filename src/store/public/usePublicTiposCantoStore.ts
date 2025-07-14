// store/public/usePublicTiposCantoStore.ts
import { create } from 'zustand';
import { obtenerTiposDeCantoPublicos } from '../../services/tiposCanto';
import type { TipoCanto } from '../../types/tiposCanto';

interface PublicTiposCantoState {
    tipos: TipoCanto[];
    cargando: boolean;
    error: string | null;
    fetchTiposPublicos: () => Promise<void>;
}

export const usePublicTiposCantoStore = create<PublicTiposCantoState>((set) => ({
    tipos: [],
    cargando: false,
    error: null,

    fetchTiposPublicos: async () => {
        try {
            set({ cargando: true, error: null });
            const tipos = await obtenerTiposDeCantoPublicos();
            set({ tipos, cargando: false });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    }
}));
