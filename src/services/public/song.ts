import api from '../../api/axios';
import type { Song } from '../../types/song';

export const getPublicSongs = async (): Promise<Song[]> => {
    const { data } = await api.get<Song[]>('/songs/public');
    return data;
};