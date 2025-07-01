import type { Usuario } from "./usuarios";

export interface CreateUserResponse {
    mensaje: string;
    usuario: Usuario;
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
