import api from '../../api/axios';
import type { BlogPost, CreateBlogPayload } from '../../types/blog';

// Helper to bundle data for backend 'parseBody'
const createBlogFormData = (payload: CreateBlogPayload) => {
    const formData = new FormData();
    const { file, ...rest } = payload;

    // Send fields as JSON string under 'data' key
    formData.append('data', JSON.stringify(rest));

    // Send file under 'file' key
    if (file) {
        formData.append('file', file);
    }
    return formData;
};

export const getAllPosts = async (): Promise<BlogPost[]> => {
    const { data } = await api.get<BlogPost[]>('/blog');
    return data;
};

export const getPostById = async (id: string): Promise<BlogPost> => {
    const { data } = await api.get<BlogPost>(`/blog/${id}`);
    return data;
};

// 🟣 CREATE
export const createPost = async (payload: CreateBlogPayload): Promise<BlogPost> => {
    const formData = createBlogFormData(payload);
    const { data } = await api.post<{ message: string, post: BlogPost }>('/blog', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.post;
};

// 🟣 UPDATE
export const updatePost = async (id: string, payload: Partial<CreateBlogPayload>): Promise<BlogPost> => {
    const formData = new FormData();
    const { file, ...rest } = payload;

    formData.append('data', JSON.stringify(rest));
    if (file) formData.append('file', file);

    const { data } = await api.put<{ message: string, post: BlogPost }>(`/blog/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.post;
};

export const deletePost = async (id: string): Promise<void> => {
    await api.delete(`/blog/${id}`);
};

export const likePost = async (id: string): Promise<void> => {
    await api.put(`/blog/${id}/like`);
};

export const commentPost = async (id: string, text: any): Promise<void> => {
    await api.post(`/blog/${id}/comment`, { text });
};