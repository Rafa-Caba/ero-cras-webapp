import { createContext, useContext, useEffect } from 'react';
import {
    usePublicGaleriaStore,
    usePublicCantosStore,
    usePublicSettingsStore,
    usePublicMiembrosStore,
    usePublicThemesStore
} from '../store/public';

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

    useEffect(() => {
        fetchImagenesPublicas();
        fetchCantosPublicos();
        fetchSettingsPublicos();
        fetchMiembrosPublicos();
        fetchThemesPublicos();
    }, []);

    return (
        <PublicGlobalContext.Provider value={{}}>
            {children}
        </PublicGlobalContext.Provider>
    );
};

export const usePublicGlobal = () => useContext(PublicGlobalContext);
