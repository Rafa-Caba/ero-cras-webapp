export interface Choir {
    id: string;
    name: string;
    code: string;

    description?: string;
    logoUrl?: string;
    logoPublicId?: string;

    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedChoirResponse {
    choirs: Choir[];
    currentPage: number;
    totalPages: number;
    totalChoirs: number;
}

export interface CreateChoirPayload {
    name: string;
    code: string;
    description?: string;
    isActive?: boolean;
    file?: File;
}

export type ChoirUserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER' | 'USER';

export interface ChoirUser {
    id: string;
    name: string;
    username: string;
    email: string;
    role: ChoirUserRole;
    imageUrl?: string;
    imagePublicId?: string;
    instrumentId?: string | null;
    instrumentLabel?: string;
    instrument?: string;
    voice?: boolean;
    bio?: string;
    choirId?: string | null;
    lastAccess?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedChoirUsersResponse {
    users: ChoirUser[];
    currentPage: number;
    totalPages: number;
    totalUsers: number;
}

export interface CreateChoirUserPayload {
    name: string;
    username: string;
    email: string;
    password: string;
    role: ChoirUserRole;
    instrumentId?: string;
    instrumentLabel?: string;
    bio?: string;
    voice?: boolean;
}

export interface CreateChoirUserResponse {
    message: string;
    user: ChoirUser;
}

export interface UpdateChoirUserPayload {
    name: string;
    username: string;
    email: string;
    role: ChoirUserRole;
    instrumentId?: string;
    instrumentLabel?: string;
    bio?: string;
    voice?: boolean;
    password?: string;
}

export interface UpdateChoirUserResponse {
    message: string;
    user: ChoirUser;
}