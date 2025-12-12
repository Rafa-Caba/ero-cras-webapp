import api from '../../api/axios';
import type {
    Choir,
    PaginatedChoirResponse,
    CreateChoirPayload
} from '../../types/choir';

// ADMIN LIST (Paginated)
export const getChoirs = async (page: number = 1): Promise<PaginatedChoirResponse> => {
    const { data } = await api.get<PaginatedChoirResponse>(`/choirs?page=${page}`);
    return data;
};

// GET ONE
export const getChoirById = async (id: string): Promise<Choir> => {
    const { data } = await api.get<Choir>(`/choirs/${id}`);
    return data;
};

// CREATE / UPDATE (with optional logo file)
export const saveChoir = async (
    payload: CreateChoirPayload,
    file?: File,
    id?: string
): Promise<Choir> => {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('code', payload.code);

    if (payload.description) {
        formData.append('description', payload.description);
    }

    if (typeof payload.isActive === 'boolean') {
        formData.append('isActive', String(payload.isActive));
    }

    if (file) {
        formData.append('file', file);
    }

    if (id) {
        const { data } = await api.put<Choir>(`/choirs/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    } else {
        const { data } = await api.post<Choir>('/choirs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    }
};

// DELETE
export const deleteChoir = async (id: string): Promise<void> => {
    await api.delete(`/choirs/${id}`);
};
