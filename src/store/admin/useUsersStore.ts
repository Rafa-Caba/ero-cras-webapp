import { create } from 'zustand';
import { getAllUsers, saveUser, deleteUser, updateSelfProfile, updateSelfTheme } from '../../services/admin/users';
import type { User } from '../../types/auth';

interface UsersState {
    users: User[];
    currentPage: number;
    totalPages: number;
    loading: boolean;

    fetchUsers: (page?: number) => Promise<void>;
    deleteUserById: (id: string) => Promise<void>;
    saveUserAction: (data: any, file?: File, id?: string) => Promise<void>;

    updateMyProfile: (formData: FormData) => Promise<User>;
    updateMyTheme: (themeId: string) => Promise<User>;

    setCurrentPage: (page: number) => void;
    getUserById: (id: string) => User | undefined;
}

export const useUsersStore = create<UsersState>((set, get) => ({
    users: [],
    currentPage: 1,
    totalPages: 1,
    loading: false,

    fetchUsers: async (page = 1) => {
        set({ loading: true });
        try {
            const { users, totalPages } = await getAllUsers(page);
            set({ users, totalPages, currentPage: page });
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            set({ loading: false });
        }
    },

    deleteUserById: async (id: string) => {
        try {
            await deleteUser(id);
            get().fetchUsers(get().currentPage);
        } catch (error) { throw error; }
    },

    saveUserAction: async (data, file, id) => {
        try {
            await saveUser(data, file, id);
            get().fetchUsers(get().currentPage);
        } catch (error) { throw error; }
    },

    updateMyProfile: async (formData) => {
        try {
            return await updateSelfProfile(formData);
        } catch (error) { throw error; }
    },

    updateMyTheme: async (themeId) => {
        try {
            return await updateSelfTheme(themeId);
        } catch (error) { throw error; }
    },

    setCurrentPage: (page: number) => set({ currentPage: page }),

    getUserById: (id: string) => {
        return get().users.find(u => u.id === id);
    },
}));