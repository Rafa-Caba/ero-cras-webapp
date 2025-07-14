// store/admin/useTiposCantoStore.ts
import { create } from 'zustand';
import {
    obtenerTiposDeCanto,
    obtenerTipoCantoPorId,
    crearTipoCanto,
    eliminarTipoCanto,
    actualizarTipo
} from '../../services/tiposCanto';
import type { FormTipoCanto, TipoCantoState } from '../../types';

export const useTiposCantoStore = create<TipoCantoState>((set, get) => ({
    tipos: [],
    loading: false,
    paginaActual: 1,
    totalPaginas: 1,

    getTipos: async (pagina = 1, limit = 10) => {
        set({ loading: true });
        try {
            const data = await obtenerTiposDeCanto(pagina, limit);
            set({
                tipos: data.tipos,
                paginaActual: data.paginaActual ?? 1,
                totalPaginas: data.totalPaginas ?? 1
            });
        } catch (err) {
            console.error('Error al obtener tipos de canto:', err);
        } finally {
            set({ loading: false });
        }
    },

    setPaginaActual: (pagina) => {
        if (pagina !== get().paginaActual) {
            get().getTipos(pagina);
            set({ paginaActual: pagina });
        }
    },

    createTipo: async (nuevo: FormTipoCanto) => {
        set({ loading: true });
        try {
            const creado = await crearTipoCanto(nuevo);
            set((state) => ({ tipos: [...state.tipos, creado] }));
        } catch (err) {
            console.error('Error al crear tipo:', err);
        } finally {
            set({ loading: false });
        }
    },

    updateTipo: async (id, data) => {
        set({ loading: true });
        try {
            const actualizado = await actualizarTipo(id, data);
            set((state) => ({
                tipos: state.tipos.map(t => t._id === id ? actualizado : t)
            }));
        } catch (error) {
            console.error('Error al actualizar tipo:', error);
        } finally {
            set({ loading: false });
        }
    },

    deleteTipo: async (id) => {
        set({ loading: true });
        try {
            await eliminarTipoCanto(id);
            set((state) => ({ tipos: state.tipos.filter(t => t._id !== id) }));
        } catch (err) {
            console.error('Error al eliminar tipo:', err);
        } finally {
            set({ loading: false });
        }
    },

    getTipoPorId: async (id) => {
        try {
            const tipo = await obtenerTipoCantoPorId(id);
            return tipo;
        } catch (err) {
            console.error('Error al obtener tipo por ID:', err);
            return null;
        }
    }
}));
