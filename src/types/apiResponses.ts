import type { User } from "./usuarios";

export interface CreateUserResponse {
    mensaje: string;
    usuario: User;
}

export interface UpdateResponse {
    mensaje: string;
}

export interface DeleteResponse {
    mensaje: string;
}

export interface ErrorResponse {
    mensaje: string;
}
