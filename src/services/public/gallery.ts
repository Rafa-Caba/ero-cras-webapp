import api from '../../api/axios';
import type { GalleryImage } from '../../types/gallery';

export const getPublicGallery = async (): Promise<GalleryImage[]> => {
    const { data } = await api.get<GalleryImage[]>('/gallery/public');
    return data;
};