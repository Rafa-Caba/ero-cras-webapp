// 📦 Zustand Store - useThemesStore.ts (ajustado para modelo dinámico con paginación)
import { create } from 'zustand';
import {
    obtenerTema,
    crearColorClass,
    eliminarColorClass,
    actualizarColorClass,
    obtenerTemaPorId
} from '../services/themes';
import type { ThemeState } from '../types';

export const useThemesStore = create<ThemeState>((set) => ({
    themes: [],
    loading: false,
    paginaActual: 1,
    totalPaginas: 1,

    getThemes: async (pagina = 1) => {
        set({ loading: true });
        try {
            const data = await obtenerTema(pagina);
            if (data) {
                set({
                    themes: data.temas,
                    paginaActual: data.paginaActual,
                    totalPaginas: data.totalPaginas
                });
            }
        } catch (err) {
            console.error('Error al obtener los temas:', err);
        } finally {
            set({ loading: false });
        }
    },

    setPaginaActual: (pagina: number) => {
        set((state) => {
            if (pagina !== state.paginaActual) {
                state.getThemes(pagina); // Recargar los temas con la nueva página
            }
            return { paginaActual: pagina };
        });
    },

    createColorClass: async (nuevo) => {
        set({ loading: true });
        try {
            const creado = await crearColorClass(nuevo);
            set((state) => ({ themes: [...state.themes, creado] }));
        } catch (err) {
            console.error('Error al crear nueva clase de color:', err);
        } finally {
            set({ loading: false });
        }
    },

    deleteColorClass: async (id) => {
        set({ loading: true });
        try {
            await eliminarColorClass(id);
            set((state) => ({ themes: state.themes.filter(t => t._id !== id) }));
        } catch (err) {
            console.error('Error al eliminar clase de color:', err);
        } finally {
            set({ loading: false });
        }
    },

    updateColorClass: async (id, updated) => {
        set({ loading: true });
        try {
            const actualizado = await actualizarColorClass(id, updated);
            set((state) => ({
                themes: state.themes.map(t => (t._id === id ? actualizado : t))
            }));
        } catch (err) {
            console.error('Error al actualizar clase de color:', err);
        } finally {
            set({ loading: false });
        }
    },

    getColorClassById: async (id) => {
        try {
            const colorClass = await obtenerTemaPorId(id);
            return colorClass;
        } catch (err) {
            console.error('Error al obtener clase por ID:', err);
            return null;
        }
    }
}));
