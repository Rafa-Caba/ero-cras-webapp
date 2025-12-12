import api from '../../api/axios';
import type { Member } from '../../types/member';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicMembers = async (): Promise<Member[]> => {
    const { data } = await api.get<Member[]>(withChoirKey('/members/public'));
    return data;
};