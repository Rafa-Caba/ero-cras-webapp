import { create } from 'zustand';
import {
    getChoirs,
    getChoirById,
    saveChoir,
    deleteChoir
} from '../../services/admin/choirs';
import type { Choir, CreateChoirPayload, PaginatedChoirResponse } from '../../types/choir';

interface ChoirState {
    choirs: Choir[];
    currentPage: number;
    totalPages: number;
    totalChoirs: number;
    loading: boolean;

    fetchChoirs: (page?: number) => Promise<void>;
    fetchChoir: (id: string) => Promise<Choir | null>;
    saveChoirAction: (data: CreateChoirPayload, file?: File, id?: string) => Promise<Choir>;
    deleteChoirById: (id: string) => Promise<void>;

    setCurrentPage: (page: number) => void;
    getChoirByIdFromState: (id: string) => Choir | undefined;
}

export const useChoirsStore = create<ChoirState>((set, get) => ({
    choirs: [],
    currentPage: 1,
    totalPages: 1,
    totalChoirs: 0,
    loading: false,

    fetchChoirs: async (page = 1) => {
        set({ loading: true });
        try {
            const data: PaginatedChoirResponse = await getChoirs(page);
            set({
                choirs: data.choirs,
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                totalChoirs: data.totalChoirs
            });
        } catch (error) {
            console.error('Error fetching choirs:', error);
        } finally {
            set({ loading: false });
        }
    },

    fetchChoir: async (id: string) => {
        try {
            const local = get().choirs.find((c) => c.id === id);
            if (local) return local;

            const choir = await getChoirById(id);
            set((state) => ({
                choirs: [...state.choirs, choir]
            }));
            return choir;
        } catch (error) {
            console.error('Error fetching choir:', error);
            return null;
        }
    },

    saveChoirAction: async (data, file, id) => {
        const saved = await saveChoir(data, file, id);

        set((state) => {
            const exists = state.choirs.some((c) => c.id === saved.id);

            const updatedChoirs = exists
                ? state.choirs.map((c) => (c.id === saved.id ? saved : c))
                : [...state.choirs, saved];

            return {
                choirs: updatedChoirs,
                totalChoirs: exists ? state.totalChoirs : state.totalChoirs + 1
            };
        });

        return saved;
    },

    deleteChoirById: async (id: string) => {
        await deleteChoir(id);
        set((state) => ({
            choirs: state.choirs.filter((c) => c.id !== id),
            totalChoirs: state.totalChoirs > 0 ? state.totalChoirs - 1 : 0
        }));
    },

    setCurrentPage: (page: number) => set({ currentPage: page }),

    getChoirByIdFromState: (id: string) => {
        return get().choirs.find((c) => c.id === id);
    }
}));
