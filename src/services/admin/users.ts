import api from '../../api/axios';
import type { User } from '../../types/auth';

// 🟣 LIST (Paginated)
export const getAllUsers = async (page: number = 1): Promise<{ users: User[], totalPages: number }> => {
    const { data } = await api.get<{ users: User[], totalPages: number }>(`/users?page=${page}`);
    return data;
};

// 🟣 GET DIRECTORY
export const getUserDirectory = async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users/directory');
    return data;
};

// 🟣 UPDATE SELF PROFILE (Matches PUT /me)
export const updateSelfProfile = async (formData: FormData): Promise<User> => {
    const { data } = await api.put<User>('/users/me', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

// 🟣 UPDATE SELF THEME (Matches PUT /me/theme)
export const updateSelfTheme = async (themeId: string): Promise<User> => {
    const { data } = await api.put<User>('/users/me/theme', { themeId });
    return data;
};

// 🟣 ADMIN: SAVE USER
export const saveUser = async (data: any, file?: File, id?: string): Promise<void> => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) formData.append('file', file);

    if (id) {
        await api.put(`/users/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
        await api.post('/users', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
};

// 🟣 ADMIN: DELETE USER
export const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
};