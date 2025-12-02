import api from '../../api/axios';
import type { GalleryImage, CreateGalleryPayload } from '../../types/gallery';

const createFormData = (payload: any, file?: File) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    if (file) {
        formData.append('file', file);
    }
    return formData;
};

export const getAdminGallery = async (): Promise<GalleryImage[]> => {
    const { data } = await api.get<GalleryImage[]>('/gallery');
    return data;
};

export const getGalleryImageById = async (id: string): Promise<GalleryImage> => {
    const { data } = await api.get<GalleryImage>(`/gallery/${id}`);
    return data;
};

export const addImage = async (payload: CreateGalleryPayload): Promise<GalleryImage> => {
    const { file, ...dataPayload } = payload;
    const formData = createFormData(dataPayload, file);

    const { data } = await api.post<{ message: string, image: GalleryImage }>('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.image;
};

export const updateGalleryImage = async (id: string, payload: FormData): Promise<GalleryImage> => {
    const { data } = await api.put<{ message: string, image: GalleryImage }>(`/gallery/${id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.image;
};

export const removeImage = async (id: string): Promise<void> => {
    await api.delete(`/gallery/${id}`);
};

export const setFlags = async (id: string, flags: Record<string, boolean>): Promise<void> => {
    if ('imageGallery' in flags) {
        await api.patch(`/gallery/mark/imageGallery/${id}`, { value: flags.imageGallery });
    } else {
        for (const [key, value] of Object.entries(flags)) {
            if (value === true) {
                await api.patch(`/gallery/mark/${key}/${id}`);
            }
        }
    }
};