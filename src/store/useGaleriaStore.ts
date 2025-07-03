import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    obtenerImagenes,
    obtenerImagenPorId,
    crearImagen,
    actualizarImagen,
    eliminarImagen,
    marcarCampoImagen,
} from '../services/gallery';
import type { GaleriaState } from '../types';

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
                    const data = await obtenerImagenes(pagina);
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

            marcarCampo: async (id, campo) => {
                try {
                    set({ cargando: true, error: null });
                    const data = await marcarCampoImagen(id, campo);
                    const refreshed = await obtenerImagenes();
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
            name: 'galeria-store',
        }
    )
);
