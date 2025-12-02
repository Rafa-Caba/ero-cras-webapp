import api from '../../api/axios';
import type { Announcement, CreateAnnouncementPayload } from '../../types/annoucement';

// Helper to bundle data for backend 'parseBody'
const createFormData = (payload: CreateAnnouncementPayload) => {
    const formData = new FormData();
    const { file, ...rest } = payload;

    formData.append('data', JSON.stringify(rest));

    if (file) {
        formData.append('file', file);
    }
    return formData;
};

export const getAdminAnnouncements = async (): Promise<Announcement[]> => {
    const { data } = await api.get<Announcement[]>('/announcements/admin');
    return data;
};

// GET ONE
export const getAnnouncementById = async (id: string): Promise<Announcement> => {
    const { data } = await api.get<Announcement>(`/announcements/${id}`);
    return data;
};

// CREATE
export const createAnnouncement = async (payload: CreateAnnouncementPayload): Promise<Announcement> => {
    const formData = createFormData(payload);
    const { data } = await api.post<{ message: string, announcement: Announcement }>('/announcements', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.announcement;
};

// UPDATE
export const updateAnnouncement = async (id: string, payload: Partial<CreateAnnouncementPayload>): Promise<Announcement> => {
    const formData = new FormData();
    const { file, ...rest } = payload;

    formData.append('data', JSON.stringify(rest));
    if (file) formData.append('file', file);

    const { data } = await api.put<Announcement>(`/announcements/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const deleteAnnouncement = async (id: string): Promise<void> => {
    await api.delete(`/announcements/${id}`);
};