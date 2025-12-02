import api from '../../api/axios';
import type { Member } from '../../types/member';

export const getPublicMembers = async (): Promise<Member[]> => {
    // Matches Backend: router.get('/public', ...)
    const { data } = await api.get<Member[]>('/members/public');
    return data;
};