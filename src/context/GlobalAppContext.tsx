import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGaleriaStore } from '../store/admin/useGaleriaStore';
import { useCantosStore } from '../store/admin/useCantosStore';
import { useUsuariosStore } from '../store/admin/useUsuariosStore';
import { useMiembrosStore } from '../store/admin/useMiembrosStore';
import { useAvisosStore } from '../store/admin/useAvisosStore';
import { useBlogPostsStore } from '../store/admin/useBlogPostsStore';
import { useSettingsStore } from '../store/admin/useSettingsStore';
import { useThemeGroupsStore } from '../store/admin/useThemeGroupsStore';

interface GlobalAppContextProps {
    cargado: boolean;
}

const GlobalAppContext = createContext<GlobalAppContextProps>({ cargado: false });

const GlobalAppProvider = ({ children }: { children: React.ReactNode }) => {
    const [cargado, setCargado] = useState(false);
    const { user } = useAuth();

    const { fetchImagenes } = useGaleriaStore();
    const { obtenerTodos } = useCantosStore();
    const { fetchUsuarios } = useUsuariosStore();
    const { fetchMiembros } = useMiembrosStore();
    const { fetchAvisos } = useAvisosStore();
    const { fetchPosts } = useBlogPostsStore();
    const { fetchSettings } = useSettingsStore();
    const { fetchGrupos, temaActivo, fetchTemaActivo } = useThemeGroupsStore();

    useEffect(() => {
        if (!user) return;

        const cargarDatos = async () => {
            try {
                await Promise.all([
                    fetchImagenes(1),
                    obtenerTodos(),
                    fetchUsuarios(1),
                    fetchMiembros(1),
                    fetchAvisos(1),
                    fetchPosts(1),
                    fetchSettings(),
                    fetchGrupos(1),
                ]);
                setCargado(true);
            } catch (error) {
                console.error('Error al cargar datos globales:', error);
            }
        };

        cargarDatos();
    }, [user]);

    useEffect(() => {
        const cargarTemaActivo = async () => {
            try {
                await fetchTemaActivo();
            } catch (err) {
                console.warn('Error al obtener tema activo desde backend', err);
            }
        };

        cargarTemaActivo();
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

export default GlobalAppProvider; // ✅ default
export const useGlobalApp = () => useContext(GlobalAppContext); // ✅ ok, sin cambio necesario
