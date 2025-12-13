import api from '../../api/axios';
import type { Instrument, CreateInstrumentPayload } from '../../types/instrument';

// Shared helper (same pattern as gallery)
const createFormData = (payload: any, file?: File) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    if (file) {
        formData.append('file', file);
    }
    return formData;
};

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
    const {
        name,
        slug,
        iconKey,
        category,
        isActive,
        order,
        choirId,
        choirKey
    } = payload;

    const dataPayload: any = {
        name,
        slug,
        iconKey
    };

    if (category) dataPayload.category = category;
    if (typeof isActive === 'boolean') dataPayload.isActive = isActive;
    if (typeof order === 'number') dataPayload.order = order;

    // Optional multi-choir targeting (for SUPER_ADMIN, if backend supports it)
    if (choirId) dataPayload.choirId = choirId;
    if (choirKey) dataPayload.choirKey = choirKey;

    const formData = createFormData(dataPayload, file);

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
