import { create } from 'zustand';
import { getLogs } from '../../services/admin/log';
import type { Log } from '../../types/log';

interface LogState {
    logs: Log[];
    userLogs: Log[]; // For MyProfile
    currentPage: number;
    totalPages: number;
    totalLogs: number;
    loading: boolean;

    // Actions
    fetchLogs: (page?: number, filters?: any) => Promise<void>;
    fetchUserLogs: (userId: string) => Promise<void>;
    setPage: (page: number) => void;
    searchLogsText: (query: string) => Promise<void>;
}

export const useLogStore = create<LogState>((set, get) => ({
    logs: [],
    userLogs: [],
    currentPage: 1,
    totalPages: 1,
    totalLogs: 0,
    loading: false,

    fetchLogs: async (page = 1, filters = {}) => {
        set({ loading: true });
        try {
            const data = await getLogs(page, 20, filters);
            set({
                logs: data.logs,
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                totalLogs: data.totalLogs
            });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    },

    fetchUserLogs: async (userId: string) => {
        set({ loading: true });
        try {
            const data = await getLogs(1, 50, { userId });
            set({ userLogs: data.logs });
        } catch (e) { console.error(e); }
        finally { set({ loading: false }); }
    },

    setPage: (page: number) => set({ currentPage: page }),

    searchLogsText: async (query: string) => {
        get().fetchLogs(1, { search: query });
    }
}));