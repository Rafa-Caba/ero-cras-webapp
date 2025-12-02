import api from '../../api/axios';
import type { SongType } from '../../types/song';

export const getAllSongTypes = async (): Promise<SongType[]> => {
    const { data } = await api.get<{ types: SongType[] }>('/song-types?all=true');
    return data.types;
};

export const createSongType = async (payload: { name: string; order: number; parentId?: string; isParent?: boolean }): Promise<SongType> => {
    const { data } = await api.post<SongType>('/song-types', payload);
    return data;
};

export const updateSongType = async (id: string, payload: { name?: string; order?: number; isParent?: boolean }): Promise<SongType> => {
    const { data } = await api.put<SongType>(`/song-types/${id}`, payload);
    return data;
};

export const deleteSongType = async (id: string): Promise<void> => {
    await api.delete(`/song-types/${id}`);
};