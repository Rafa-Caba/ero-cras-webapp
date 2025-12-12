import api from '../../api/axios';
import type { Theme } from '../../types/theme';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicThemes = async (): Promise<Theme[]> => {
    const { data } = await api.get<{ themes: Theme[] }>(withChoirKey('/themes/public'));
    return data.themes;
};
