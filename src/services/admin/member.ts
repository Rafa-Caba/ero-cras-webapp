import api from '../../api/axios';
import type { Member, PaginatedMemberResponse, CreateMemberPayload } from '../../types/member';

// LIST (Paginated)
export const getPaginatedMembers = async (page: number = 1, limit: number = 10): Promise<PaginatedMemberResponse> => {
    const { data } = await api.get<PaginatedMemberResponse>('/members', {
        params: { page, limit }
    });
    return data;
};

// SEARCH (Flat Array)
export const searchMembers = async (query: string): Promise<Member[]> => {
    const { data } = await api.get<Member[]>('/members/search', {
        params: { q: query }
    });
    return data;
};

// GET ONE
export const getMemberById = async (id: string): Promise<Member> => {
    const { data } = await api.get<Member>(`/members/${id}`);
    return data;
};

// CREATE
export const createMember = async (payload: CreateMemberPayload): Promise<Member> => {
    const formData = new FormData();

    const dataPayload = {
        name: payload.name,
        instrument: payload.instrument,
        voice: payload.voice
    };
    formData.append('data', JSON.stringify(dataPayload));

    if (payload.file) {
        formData.append('file', payload.file);
    }

    const { data } = await api.post('/members', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data.member;
};

// UPDATE
export const updateMember = async (id: string, payload: Partial<CreateMemberPayload>): Promise<Member> => {
    const formData = new FormData();

    const dataPayload: any = {};
    if (payload.name) dataPayload.name = payload.name;
    if (payload.instrument) dataPayload.instrument = payload.instrument;
    if (payload.voice !== undefined) dataPayload.voice = payload.voice;

    formData.append('data', JSON.stringify(dataPayload));

    if (payload.file) {
        formData.append('file', payload.file);
    }

    const { data } = await api.put<Member>(`/members/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

// DELETE
export const deleteMember = async (id: string): Promise<void> => {
    await api.delete(`/members/${id}`);
};