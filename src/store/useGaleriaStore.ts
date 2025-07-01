import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    obtenerImagenes,
    obtenerImagenPorId,
    crearImagen,
    actualizarImagen,
    eliminarImagen,
    destacarImagen,
} from '../services/gallery';
import type { ImagenGaleria, ImagenResponse, ImagenesResponse } from '../types';

interface GaleriaState {
    imagenes: ImagenGaleria[];
    imagenSeleccionada: ImagenGaleria | null;
    paginaActual: number;
    totalPaginas: number;
    cargando: boolean;
    error: string | null;

    // Acciones
    fetchImagenes: (pagina?: number) => Promise<void>;
    fetchImagenPorId: (id: string) => Promise<void>;
    crearNuevaImagen: (formData: FormData) => Promise<void>;
    actualizarImagenExistente: (id: string, formData: FormData) => Promise<void>;
    destacarImagen: (id: string) => Promise<ImagenResponse>;
    eliminarImagenPorId: (id: string) => Promise<void>;
}

export const useGaleriaStore = create<GaleriaState>()(
    persist(
        (set) => ({
            imagenes: [],
            imagenSeleccionada: null,
            paginaActual: 1,
            totalPaginas: 1,
            cargando: false,
            error: null,

            fetchImagenes: async (pagina = 1) => {
                try {
                    set({ cargando: true, error: null });
                    const data: ImagenesResponse = await obtenerImagenes(pagina);
                    set({
                        imagenes: data.imagenes,
                        paginaActual: data.paginaActual,
                        totalPaginas: data.totalPaginas,
                        cargando: false,
                    });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            fetchImagenPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    const imagen = await obtenerImagenPorId(id);
                    set({ imagenSeleccionada: imagen, cargando: false });
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            crearNuevaImagen: async (formData) => {
                try {
                    set({ cargando: true, error: null });
                    const data = await crearImagen(formData);
                    set((state) => ({
                        imagenes: [data.imagen, ...state.imagenes],
                        cargando: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            actualizarImagenExistente: async (id, formData) => {
                try {
                    set({ cargando: true, error: null });
                    const data = await actualizarImagen(id, formData);
                    set((state) => ({
                        imagenes: state.imagenes.map((img) =>
                            img._id === id ? data.imagen : img
                        ),
                        cargando: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },

            destacarImagen: async (id: string) => {
                try {
                    set({ cargando: true, error: null });
                    const data = await destacarImagen(id);
                    const refreshed = await obtenerImagenes(); // <-- refresca la lista
                    set({
                        imagenes: refreshed.imagenes,
                        paginaActual: refreshed.paginaActual,
                        totalPaginas: refreshed.totalPaginas,
                        cargando: false,
                    });
                    return data;
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                    throw error;
                }
            },

            eliminarImagenPorId: async (id) => {
                try {
                    set({ cargando: true, error: null });
                    await eliminarImagen(id);
                    set((state) => ({
                        imagenes: state.imagenes.filter((img) => img._id !== id),
                        cargando: false,
                    }));
                } catch (error: any) {
                    set({ error: error.message, cargando: false });
                }
            },
        }),
        {
            name: 'galeria-store', // clave del localStorage
        }
    )
);
