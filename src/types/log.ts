import type { User } from './auth';

export interface Log {
    id: string;
    user: User | { id: string; name: string; username: string; role: string };
    collectionName: string;
    action: 'create' | 'update' | 'delete' | 'add_reaction' | 'remove_reaction';
    referenceId: string;
    description?: string;
    changes?: {
        before?: any;
        after?: any;
        new?: any;
        deleted?: any;
        updated?: any;
    };
    createdAt: string;
}

export interface LogsResponse {
    logs: Log[];
    currentPage: number;
    totalPages: number;
    totalLogs: number;
}

export interface UserLogsResponse {
    logs: Log[];
    currentPage: number;
    totalPages: number;
}