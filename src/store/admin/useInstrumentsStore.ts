import { create } from 'zustand';
import {
    getInstruments,
    getInstrumentById,
    saveInstrument,
    deleteInstrument
} from '../../services/admin/instruments';
import type { Instrument, CreateInstrumentPayload } from '../../types/instrument';

interface InstrumentsState {
    instruments: Instrument[];
    loading: boolean;

    // Actions
    fetchInstruments: () => Promise<void>;
    fetchInstrumentById: (id: string) => Promise<Instrument | null>;
    saveInstrumentAction: (
        payload: CreateInstrumentPayload,
        file?: File,
        id?: string
    ) => Promise<Instrument>;
    deleteInstrumentById: (id: string) => Promise<void>;

    getInstrumentFromState: (id: string) => Instrument | undefined;
}

export const useInstrumentsStore = create<InstrumentsState>((set, get) => ({
    instruments: [],
    loading: false,

    fetchInstruments: async () => {
        set({ loading: true });
        try {
            const data = await getInstruments();
            set({ instruments: data });
        } catch (error) {
            console.error('Error fetching instruments:', error);
        } finally {
            set({ loading: false });
        }
    },

    fetchInstrumentById: async (id: string) => {
        const existing = get().instruments.find(inst => inst.id === id);
        if (existing) return existing;

        try {
            const instrument = await getInstrumentById(id);
            const current = get().instruments;
            const alreadyInList = current.some(inst => inst.id === instrument.id);

            set({
                instruments: alreadyInList
                    ? current.map(inst =>
                        inst.id === instrument.id ? instrument : inst
                    )
                    : [...current, instrument]
            });

            return instrument;
        } catch (error) {
            console.error('Error fetching instrument by id:', error);
            return null;
        }
    },

    saveInstrumentAction: async (payload, file, id) => {
        try {
            const instrument = await saveInstrument(payload, file, id);

            await get().fetchInstruments();

            return instrument;
        } catch (error) {
            console.error('Error saving instrument:', error);
            throw error;
        }
    },

    deleteInstrumentById: async (id: string) => {
        try {
            await deleteInstrument(id);
            set(state => ({
                instruments: state.instruments.filter(inst => inst.id !== id)
            }));
        } catch (error) {
            console.error('Error deleting instrument:', error);
            throw error;
        }
    },

    getInstrumentFromState: (id: string) => {
        return get().instruments.find(inst => inst.id === id);
    }
}));
