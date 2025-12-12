import api from '../../api/axios';
import type { SongType } from '../../types/song';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicSongTypes = async (): Promise<SongType[]> => {
    const { data } = await api.get<{ types: SongType[] }>(withChoirKey('/song-types/public'));
    return data.types;
};