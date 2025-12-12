import api from '../../api/axios';
import type { Song } from '../../types/song';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicSongs = async (): Promise<Song[]> => {
    const { data } = await api.get<Song[]>(withChoirKey('/songs/public'));
    return data;
};