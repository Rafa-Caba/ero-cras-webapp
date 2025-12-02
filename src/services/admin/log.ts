import api from '../../api/axios';
import type { LogsResponse, UserLogsResponse } from '../../types/log';

export const getLogs = async (page = 1, limit = 20, filters: any = {}): Promise<LogsResponse> => {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters
    });
    const { data } = await api.get<LogsResponse>(`/logs?${params.toString()}`);
    return data;
};

export const getUserLogs = async (userId: string, page = 1, limit = 10): Promise<UserLogsResponse> => {
    const { data } = await api.get<UserLogsResponse>(`/logs/user/${userId}?page=${page}&limit=${limit}`);
    return data;
};