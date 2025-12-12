import api from '../api/axios';
import type {
    AuthResponse,
    LoginPayload,
    RegisterPayload,
    User,
} from '../types/auth';

// LOGIN
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', payload);
    return data;
};

// REGISTER
export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
};

// PROFILE
export const getUserProfile = async (): Promise<User> => {
    const { data } = await api.get<User>('/users/me');
    return data;
};
