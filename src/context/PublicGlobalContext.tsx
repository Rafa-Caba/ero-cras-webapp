import { createContext, useContext, useEffect } from 'react';
import {
    usePublicGaleriaStore,
    usePublicCantosStore,
    usePublicSettingsStore,
    usePublicMiembrosStore,
    usePublicThemesStore
} from '../store/public';
import { usePublicThemeGroupsStore } from '../store/public/usePublicThemeGroupsStore';

interface Props {
    children: React.ReactNode;
}

const PublicGlobalContext = createContext({});

export const PublicGlobalProvider = ({ children }: Props) => {
    const { fetchImagenesPublicas } = usePublicGaleriaStore();
    const { fetchCantosPublicos } = usePublicCantosStore();
    const { fetchSettingsPublicos } = usePublicSettingsStore();
    const { fetchMiembrosPublicos } = usePublicMiembrosStore();
    const { fetchThemesPublicos } = usePublicThemesStore();
    const { fetchThemeGroupsPublicos, fetchGrupoActivoPublico, temaActivo } = usePublicThemeGroupsStore();

    useEffect(() => {
        fetchImagenesPublicas();
        fetchCantosPublicos();
        fetchSettingsPublicos();
        fetchMiembrosPublicos();
        fetchThemesPublicos();
        fetchThemeGroupsPublicos();
    }, []);

    useEffect(() => {
        const cargarTemaActivoPublico = async () => {
            try {
                await fetchGrupoActivoPublico(); // del store público
            } catch (err) {
                console.warn('Error al obtener grupo activo público', err);
            }
        };

        cargarTemaActivoPublico();
    }, []);

    useEffect(() => {
        if (temaActivo) {
            const root = document.documentElement;
            temaActivo.colores.forEach(({ colorClass, color }) => {
                root.style.setProperty(`--color-${colorClass}`, color);
            });
        }
    }, [temaActivo]);

    return (
        <PublicGlobalContext.Provider value={{}}>
            {children}
        </PublicGlobalContext.Provider>
    );
};

export const usePublicGlobal = () => useContext(PublicGlobalContext);
