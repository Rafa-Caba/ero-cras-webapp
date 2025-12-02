export interface TipTapContent {
    type: string;
    content?: any[];
}

export interface Announcement {
    id: string;
    title: string;
    content: TipTapContent;
    imageUrl?: string;
    imagePublicId?: string;
    isPublic: boolean;

    createdBy?: {
        id: string;
        name: string;
        username: string;
    };

    createdAt: string;
    updatedAt: string;
}

export interface CreateAnnouncementPayload {
    title: string;
    content: {
        type: string;
        content: any[];
    };
    imageUri?: string;
    file?: File;
    isPublic: boolean;
}