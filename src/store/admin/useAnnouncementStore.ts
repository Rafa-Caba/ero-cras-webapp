import { create } from 'zustand';
import {
    getAdminAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, getAnnouncementById
} from '../../services/admin/announcement';
import type { Announcement, CreateAnnouncementPayload } from '../../types/annoucement';

interface AdminAnnouncementState {
    announcements: Announcement[];
    loading: boolean;
    fetchAnnouncements: () => Promise<void>;
    getAnnouncement: (id: string) => Promise<Announcement | null>; // NEW
    addAnnouncement: (payload: CreateAnnouncementPayload) => Promise<void>;
    editAnnouncement: (id: string, payload: Partial<CreateAnnouncementPayload>) => Promise<void>;
    removeAnnouncement: (id: string) => Promise<void>;
}

export const useAnnouncementStore = create<AdminAnnouncementState>((set, get) => ({
    announcements: [],
    loading: false,

    fetchAnnouncements: async () => {
        set({ loading: true });
        try {
            const data = await getAdminAnnouncements();
            set({ announcements: data });
        } catch (error) {
            console.error(error);
        } finally {
            set({ loading: false });
        }
    },

    getAnnouncement: async (id) => {
        set({ loading: true });
        try {
            const data = await getAnnouncementById(id);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        } finally {
            set({ loading: false });
        }
    },

    addAnnouncement: async (payload) => {
        set({ loading: true });
        try {
            await createAnnouncement(payload);
            await get().fetchAnnouncements();
        } catch (error) {
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    editAnnouncement: async (id, payload) => {
        set({ loading: true });
        try {
            await updateAnnouncement(id, payload);
            await get().fetchAnnouncements();
        } catch (error) {
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    removeAnnouncement: async (id) => {
        try {
            await deleteAnnouncement(id);
            set(state => ({ announcements: state.announcements.filter(a => a.id !== id) }));
        } catch (error) {
            throw error;
        }
    }
}));