import { createContext, useContext, useEffect, useState } from 'react';
import { useThemesStore } from '../store/useThemesStore';
import { useGaleriaStore } from '../store/useGaleriaStore';
import { useCantosStore } from '../store/useCantosStore';
import { useUsuariosStore } from '../store/useUsuariosStore';

interface GlobalAppContextProps {
    cargado: boolean;
}

const GlobalAppContext = createContext<GlobalAppContextProps>({ cargado: false });

export const GlobalAppProvider = ({ children }: { children: React.ReactNode }) => {
    const [cargado, setCargado] = useState(false);

    const { getThemes } = useThemesStore();
    const { fetchImagenes } = useGaleriaStore();
    const { obtenerTodos } = useCantosStore();
    const { fetchUsuarios } = useUsuariosStore();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await Promise.all([
                    getThemes(1),
                    fetchImagenes(1),
                    obtenerTodos(),
                    fetchUsuarios(1)
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
