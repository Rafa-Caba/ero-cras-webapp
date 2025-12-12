export interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'EDITOR' | 'VIEWER' | 'USER' | 'SUPER_ADMIN';

    imageUrl?: string;
    imagePublicId?: string;

    instrument?: string;
    instrumentId?: string | null;
    instrumentLabel?: string;

    voice?: boolean;
    bio?: string;

    themeId?: any;
    pushToken?: string | null;

    choirId?: string;
    choirName?: string;
    choirCode?: string;

    lastAccess?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    message?: string;
    accessToken: string;
    refreshToken: string;
    role: string;
    user: User;

    choirId?: string;
    choirCode?: string;
}

export interface LoginPayload {
    username: string;
    password: string;

    choirCode?: string;
}

export interface RegisterPayload {
    name: string;
    username: string;
    email: string;
    password: string;
    instrument?: string;

    choirCode?: string;
}
