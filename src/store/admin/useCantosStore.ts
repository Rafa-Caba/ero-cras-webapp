import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
    obtenerCantos,
    obtenerCantoPorId,
    crearCanto,
    actualizarCanto,
    eliminarCanto
} from '../../services/cantos';
import type { Canto } from '../../types';


interface CantosState {
    cantos: Canto[];
    cantoSeleccionado: Canto | null;
    loading: boolean;
    error: string | null;

    obtenerTodos: () => Promise<void>;
    obtenerUno: (id: string) => Promise<void>;
    crear: (nuevo: Canto) => Promise<void>;
    actualizar: (id: string, datos: Canto) => Promise<void>;
    eliminar: (id: string) => Promise<void>;
    resetCantos: () => void;
}

export const useCantosStore = create<CantosState>()(
    devtools((set, get) => ({
        cantos: [],
        cantoSeleccionado: null,
        loading: false,
        error: null,

        obtenerTodos: async () => {
            set({ loading: true, error: null });
            try {
                const data = await obtenerCantos();
                set({ cantos: data });
            } catch (err) {
                set({ error: 'Error al obtener los cantos' });
            } finally {
                set({ loading: false });
            }
        },

        obtenerUno: async (id: string) => {
            set({ loading: true, error: null });
            try {
                const data = await obtenerCantoPorId(id);
                set({ cantoSeleccionado: data });
            } catch (err) {
                set({ error: 'Error al obtener el canto' });
            } finally {
                set({ loading: false });
            }
        },

        crear: async (nuevo: Canto) => {
            set({ loading: true, error: null });
            try {
                const creado = await crearCanto(nuevo);
                set({ cantos: [...get().cantos, creado] });
            } catch (err) {
                set({ error: 'Error al crear el canto' });
            } finally {
                set({ loading: false });
            }
        },

        actualizar: async (id: string, datos: Canto) => {
            set({ loading: true, error: null });
            try {
                const actualizado = await actualizarCanto(id, datos);
                set({
                    cantos: get().cantos.map((c) =>
                        c._id === id ? actualizado : c
                    ),
                    cantoSeleccionado: actualizado
                });
            } catch (err) {
                set({ error: 'Error al actualizar el canto' });
            } finally {
                set({ loading: false });
            }
        },

        eliminar: async (id: string) => {
            set({ loading: true, error: null });
            try {
                await eliminarCanto(id);
                set({ cantos: get().cantos.filter((c) => c._id !== id) });
            } catch (err) {
                set({ error: 'Error al eliminar el canto' });
            } finally {
                set({ loading: false });
            }
        },

        resetCantos: () => {
            set({
                cantos: [],
                cantoSeleccionado: null,
                loading: false,
                error: null
            });
        }
    }))
);
