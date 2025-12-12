import api from '../../api/axios';
import type { Announcement } from '../../types/annoucement';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicAnnouncements = async (): Promise<Announcement[]> => {
    const { data } = await api.get<Announcement[]>(withChoirKey('/announcements/public'));
    return data;
};