import { create } from 'zustand';
import { getPublicAnnouncements } from '../../services/public/announcement';
import type { Announcement } from '../../types/annoucement';

interface PublicAnnouncementState {
    announcements: Announcement[];
    loading: boolean;
    fetchAnnouncements: () => Promise<void>;
}

export const useAnnouncementStore = create<PublicAnnouncementState>((set) => ({
    announcements: [],
    loading: false,
    fetchAnnouncements: async () => {
        set({ loading: true });
        try {
            const data = await getPublicAnnouncements();
            set({ announcements: data });
        } catch (error) {
            console.error("Failed to fetch public announcements", error);
        } finally {
            set({ loading: false });
        }
    }
}));