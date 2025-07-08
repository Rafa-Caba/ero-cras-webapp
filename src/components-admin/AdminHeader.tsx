import { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useSettingsStore } from '../store/admin/useSettingsStore';

export const AdminHeader = () => {
    const { user } = useAuth();
    const { settings, fetchSettings } = useSettingsStore();

    useEffect(() => {
        fetchSettings();
    }, []);

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
                    <div className="contador_visitas d-flex flex-row align-items-center">
                        <p className="titulo mb-1 text-center fs-4 text-md-end">¡Hola {user.nombre}!</p>
                        <Image
                            src={user.fotoPerfilUrl || '/images/default-user.png'}
                            roundedCircle
                            height={50}
                            width={50}
                            alt={user.nombre}
                            style={{
                                objectFit: 'cover',
                                width: '50px',
                                height: '50px',
                                minWidth: '50px',
                                minHeight: '50px',
                                border: '1px solid black',
                                margin: '.3rem'
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

