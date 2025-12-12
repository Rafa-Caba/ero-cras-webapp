import api from '../../api/axios';
import type { Instrument } from '../../types/instrument';

export const getPublicInstruments = async (): Promise<Instrument[]> => {
    const { data } = await api.get<Instrument[]>('/instruments/public');
    return data;
};
