import api from '../../api/axios';
import type { Instrument, CreateInstrumentPayload } from '../../types/instrument';

// ADMIN: Get all instruments (no pagination for now)
export const getInstruments = async (): Promise<Instrument[]> => {
    const { data } = await api.get<Instrument[]>('/instruments');
    return data;
};

// ADMIN: Get single instrument by id
export const getInstrumentById = async (id: string): Promise<Instrument> => {
    const { data } = await api.get<Instrument>(`/instruments/${id}`);
    return data;
};

// ADMIN: Create or update an instrument with optional icon file
export const saveInstrument = async (
    payload: CreateInstrumentPayload,
    file?: File,
    id?: string
): Promise<Instrument> => {
    const formData = new FormData();

    formData.append('name', payload.name);
    formData.append('slug', payload.slug);
    formData.append('iconKey', payload.iconKey);

    if (payload.category) {
        formData.append('category', payload.category);
    }

    if (typeof payload.isActive === 'boolean') {
        formData.append('isActive', String(payload.isActive));
    }

    if (typeof payload.order === 'number') {
        formData.append('order', String(payload.order));
    }

    if (file) {
        formData.append('file', file);
    }

    if (id) {
        // UPDATE
        const { data } = await api.put<{ message: string; instrument: Instrument }>(
            `/instruments/${id}`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        return data.instrument;
    } else {
        // CREATE
        const { data } = await api.post<{ message: string; instrument: Instrument }>(
            '/instruments',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        return data.instrument;
    }
};

// ADMIN: Delete instrument
export const deleteInstrument = async (id: string): Promise<void> => {
    await api.delete(`/instruments/${id}`);
};
