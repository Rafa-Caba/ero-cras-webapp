import api, { publicApi } from "../api/axios";
import type { GruposPublicosResponse, ThemeGroup, ThemeGroupForm } from "../types";

// Obtener grupos paginados o todos
export const obtenerThemeGroups = async (page?: number, limit?: number): Promise<{
    grupos: ThemeGroup[];
    paginaActual?: number;
    totalPaginas?: number;
    totalGrupos?: number;
}> => {
    const queryParams = page && limit
        ? `?page=${page}&limit=${limit}`
        : `?all=true`;

    const res = await api.get(`/themes-group${queryParams}`);
    return res.data;
};

// Obtener un grupo por ID
export const obtenerThemeGroupPorId = async (id: string): Promise<ThemeGroup> => {
    const res = await api.get(`/themes-group/${id}`);
    return res.data;
};

// Crear nuevo grupo
export const crearThemeGroup = async (data: ThemeGroupForm): Promise<ThemeGroup> => {
    const res = await api.post(`/themes-group/new`, data);
    return res.data;
};

// Actualizar grupo
export const actualizarThemeGroup = async (id: string, data: Partial<ThemeGroup>): Promise<ThemeGroup> => {
    const res = await api.put(`/themes-group/${id}`, data);
    return res.data;
};

// Eliminar grupo
export const eliminarThemeGroup = async (id: string): Promise<void> => {
    await api.delete(`/themes-group/${id}`);
};

// Obtener grupos (Public)
export const obtenerThemeGroupsPublicos = async (): Promise<ThemeGroup[]> => {
    const res = await publicApi.get<GruposPublicosResponse>('/themes-group/public');
    return res.data.grupos;
};

// Activar un grupo como tema activo
export const activarThemeGroup = async (id: string): Promise<void> => {
    await api.put(`/themes-group/activar/${id}`);
};

// Obtener el grupo activo (admin)
export const obtenerGrupoActivo = async (): Promise<ThemeGroup | null> => {
    const res = await api.get(`/themes-group/activo`);
    return res.data;
};

// Obtener el grupo activo (público)
export const obtenerGrupoActivoPublico = async (): Promise<ThemeGroup | null> => {
    const res = await publicApi.get(`/themes-group/public/activo`);
    return res.data;
};