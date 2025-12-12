import api from '../../api/axios';
import type { BlogPost } from '../../types/blog';
import { withChoirKey } from '../../utils/choirKey';

export const getPublicPosts = async (): Promise<BlogPost[]> => {
    const { data } = await api.get<BlogPost[]>(withChoirKey('/blog/public'));
    return data;
};

export const getPublicPostById = async (id: string): Promise<BlogPost> => {
    const { data } = await api.get<BlogPost>(withChoirKey(`/blog/${id}`));
    return data;
};