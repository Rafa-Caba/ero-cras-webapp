import { create } from 'zustand';
import { getPublicInstruments } from '../../services/public/instruments';
import type { Instrument } from '../../types/instrument';

interface PublicInstrumentsState {
    instruments: Instrument[];
    loading: boolean;
    initialized: boolean;

    fetchPublicInstruments: () => Promise<void>;
}

export const usePublicInstrumentsStore = create<PublicInstrumentsState>((set, get) => ({
    instruments: [],
    loading: false,
    initialized: false,

    fetchPublicInstruments: async () => {
        if (get().initialized) return;

        set({ loading: true });
        try {
            const data = await getPublicInstruments();
            set({ instruments: data, initialized: true });
        } catch (error) {
            console.error('Error fetching public instruments:', error);
        } finally {
            set({ loading: false });
        }
    }
}));
