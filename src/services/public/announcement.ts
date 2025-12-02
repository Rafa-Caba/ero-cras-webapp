import api from '../../api/axios';
import type { Announcement } from '../../types/annoucement';

export const getPublicAnnouncements = async (): Promise<Announcement[]> => {
    const { data } = await api.get<Announcement[]>('/announcements/public');
    return data;
};