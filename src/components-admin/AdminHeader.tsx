import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../hooks/useAuth';
import { useSettingsStore } from '../store/admin/useSettingsStore';
import { UserMenu } from '../components/user-menu/UserMenu';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { formatearNombre } from '../utils';

export const AdminHeader = () => {
    const navigate = useNavigate();
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

                    <div className="d-flex align-items-center gap-3">
                        <p className="titulo mb-1 text-center fs-4 text-md-end">¡Hola {formatearNombre(user.nombre)}!</p>

                        <Button
                            variant="link"
                            title="Abrir chat grupal"
                            onClick={() => navigate('/admin/chat')}
                            className="chat-icon-btn p-0 m-0 border-0 d-flex align-items-center"
                        >
                            <FontAwesomeIcon icon={faComments} style={{ fontSize: '1.8rem' }} />
                        </Button>

                        <div className="d-flex align-items-center">
                            <UserMenu />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

