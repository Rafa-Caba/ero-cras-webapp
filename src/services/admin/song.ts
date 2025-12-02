import api from '../../api/axios';
import type { Song, CreateSongPayload, SongType } from '../../types/song';

const createFormData = (payload: any, file?: File) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));
    if (file) formData.append('file', file);
    return formData;
};

export const getAllSongs = async (): Promise<Song[]> => {
    const { data } = await api.get<Song[]>('/songs');
    return data;
};

export const getSongById = async (id: string): Promise<Song> => {
    const { data } = await api.get<Song>(`/songs/${id}`);
    return data;
};

export const getSongTypeById = async (id: string): Promise<SongType> => {
    const { data } = await api.get<SongType>(`/song-types/${id}`);
    return data;
};

export const createSong = async (payload: CreateSongPayload): Promise<Song> => {
    const { file, ...dataPayload } = payload;
    const formData = createFormData(dataPayload, file);
    const { data } = await api.post<Song>('/songs', formData);
    return data;
};

export const updateSong = async (id: string, payload: Partial<CreateSongPayload>): Promise<Song> => {
    const { file, ...dataPayload } = payload;
    const formData = createFormData(dataPayload, file);
    const { data } = await api.put<Song>(`/songs/${id}`, formData);
    return data;
};

export const deleteSong = async (id: string): Promise<void> => {
    await api.delete(`/songs/${id}`);
};