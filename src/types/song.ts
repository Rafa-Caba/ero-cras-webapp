import type { TipTapContent } from './annoucement';

export interface SongType {
    id: string;
    name: string;
    order: number;
    parentId?: string;
    isParent: boolean;
}

export interface Song {
    id: string;
    title: string;
    composer?: string;
    content: TipTapContent;

    songTypeId: string | null;
    songTypeName: string;
    audioUrl?: string;

    createdAt: string;
    updatedAt: string;
}

export interface CreateSongPayload {
    title: string;
    composer?: string;
    content: TipTapContent;
    songTypeId: string;
    file?: File;
}