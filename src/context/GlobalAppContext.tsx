import { createContext, useContext, useEffect, useState } from 'react';
import { useThemesStore } from '../store/admin/useThemesStore';
import { useGaleriaStore } from '../store/admin/useGaleriaStore';
import { useCantosStore } from '../store/admin/useCantosStore';
import { useUsuariosStore } from '../store/admin/useUsuariosStore';
import { useMiembrosStore } from '../store/admin/useMiembrosStore';
import { useAvisosStore } from '../store/admin/useAvisosStore';
import { useBlogPostsStore } from '../store/admin/useBlogPostsStore';
import { useSettingsStore } from '../store/admin/useSettingsStore';

interface GlobalAppContextProps {
    cargado: boolean;
}

const GlobalAppContext = createContext<GlobalAppContextProps>({ cargado: false });

export const GlobalAppProvider = ({ children }: { children: React.ReactNode }) => {
    const [cargado, setCargado] = useState(false);

    const { getAllThemes } = useThemesStore();
    const { fetchImagenes } = useGaleriaStore();
    const { obtenerTodos } = useCantosStore();
    const { fetchUsuarios } = useUsuariosStore();
    const { fetchMiembros } = useMiembrosStore();
    const { fetchAvisos } = useAvisosStore();
    const { fetchPosts } = useBlogPostsStore();
    const { fetchSettings } = useSettingsStore();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await Promise.all([
                    getAllThemes(),
                    fetchImagenes(1),
                    obtenerTodos(),
                    fetchUsuarios(1),
                    fetchMiembros(1),
                    fetchAvisos(1),
                    fetchPosts(1),
                    fetchSettings()
                ]);
                setCargado(true);
            } catch (error) {
                console.error('Error al cargar datos globales:', error);
            }
        };

        cargarDatos();
    }, []);

    return (
        <GlobalAppContext.Provider value={{ cargado }}>
            {cargado ? children : (
                <div className="pantalla-cargando d-flex justify-content-center align-items-center vh-100">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                        <p className="mt-3">Cargando recursos...</p>
                    </div>
                </div>
            )}
        </GlobalAppContext.Provider>
    );
};

export const useGlobalApp = () => useContext(GlobalAppContext);
