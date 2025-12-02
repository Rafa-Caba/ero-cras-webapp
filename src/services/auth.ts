import api from '../api/axios';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';

export const loginUser = async (credentials: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
};

export const registerUser = async (credentials: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', credentials);
    return data;
};

export const getUserProfile = async (): Promise<User> => {
    const { data } = await api.get<User>('/users/me');
    return data;
};