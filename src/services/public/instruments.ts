import api from '../../api/axios';
import type { Instrument } from '../../types/instrument';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicInstruments = async (): Promise<Instrument[]> => {
    const { data } = await api.get<Instrument[]>(withChoirKey('/instruments/public'));
    return data;
};
