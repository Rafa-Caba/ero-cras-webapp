import { create } from 'zustand';
import { getPublicMembers } from '../../services/public/member';
import type { Member } from '../../types/member';

interface PublicMemberState {
    members: Member[];
    loading: boolean;
    fetchMembers: () => Promise<void>;
}

export const useMemberStore = create<PublicMemberState>((set) => ({
    members: [],
    loading: false,
    fetchMembers: async () => {
        set({ loading: true });
        try {
            const data = await getPublicMembers();
            set({ members: data });
        } catch (e) {
            console.error("Failed to fetch public members", e);
        } finally {
            set({ loading: false });
        }
    }
}));