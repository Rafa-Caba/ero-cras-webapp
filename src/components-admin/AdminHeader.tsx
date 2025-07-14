import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSettingsStore } from '../store/admin/useSettingsStore';
import { UserMenu } from '../components/user-menu/UserMenu';

export const AdminHeader = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const { settings, fetchSettings } = useSettingsStore();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchSettings();
        }
    }, [loading, isAuthenticated]);

    if (!user) {
        return (
            <div className="text-center p-2">
                Cargando...
            </div>
        );
    }

    return (
        <header className="layout-header mb-0">
            <div className="titulo-nav px-0 d-flex flex-column">
                <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                    <div className="titulo text-center text-md-start">
                        <h1 className='mb-0'>{settings?.tituloWeb ? settings.tituloWeb : 'Company'} - Admin</h1>
                    </div>
                    <div className="contador_visitas d-flex flex-row justify-content-end align-items-center">
                        <p className="titulo mb-1 text-center fs-4 text-md-end">¡Hola {user.nombre}!</p>
                        <div className="d-flex align-items-center">
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

