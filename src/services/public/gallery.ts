import api from '../../api/axios';
import type { GalleryImage } from '../../types/gallery';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicGallery = async (): Promise<GalleryImage[]> => {
    const { data } = await api.get<GalleryImage[]>(withChoirKey('/gallery/public'));
    return data;
};