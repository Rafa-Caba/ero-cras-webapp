export interface Member {
    id: string;
    name: string;
    instrument: string;
    voice: boolean;
    imageUrl?: string;
    imagePublicId?: string;

    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedMemberResponse {
    members: Member[];
    currentPage: number;
    totalPages: number;
    totalMembers: number;
}

export interface CreateMemberPayload {
    name: string;
    instrument: string;
    voice: boolean;
    file?: File;
}