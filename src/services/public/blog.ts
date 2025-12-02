import api from '../../api/axios';
import type { BlogPost } from '../../types/blog';

export const getPublicPosts = async (): Promise<BlogPost[]> => {
    const { data } = await api.get<BlogPost[]>('/blog/public');
    return data;
};

export const getPublicPostById = async (id: string): Promise<BlogPost> => {
    const { data } = await api.get<BlogPost>(`/blog/${id}`);
    return data;
};