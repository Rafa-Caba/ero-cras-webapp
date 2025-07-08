import { create } from 'zustand';
import { obtenerImagenesPublicas } from '../../services/gallery';
import type { ImagenGaleria } from '../../types';

interface PublicGaleriaState {
    imagenes: ImagenGaleria[];
    cargando: boolean;
    error: string | null;
    fetchImagenesPublicas: () => Promise<void>;
}

export const usePublicGaleriaStore = create<PublicGaleriaState>((set) => ({
    imagenes: [],
    cargando: false,
    error: null,

    fetchImagenesPublicas: async () => {
        try {
            set({ cargando: true, error: null });
            const imagenes = await obtenerImagenesPublicas();
            set({ imagenes, cargando: false });
        } catch (error: any) {
            set({ error: error.message, cargando: false });
        }
    },
}));
