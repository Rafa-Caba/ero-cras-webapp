import api from '../../api/axios';
import type { SongType } from '../../types/song';

export const getPublicSongTypes = async (): Promise<SongType[]> => {
    const { data } = await api.get<{ types: SongType[] }>('/song-types/public');
    return data.types;
};