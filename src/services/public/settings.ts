import api from '../../api/axios';
import type { AppSettings } from '../../types/settings';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicSettings = async (): Promise<AppSettings> => {
    const { data } = await api.get<AppSettings>(withChoirKey('/settings/public'));
    return data;
};