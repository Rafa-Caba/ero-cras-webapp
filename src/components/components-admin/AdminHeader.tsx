// components/components-admin/AdminHeader.tsx
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserMenu } from '../../components/user-menu/UserMenu';
import { formatName } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import { useAdminSettingsStore } from '../../store/admin/useSettingsStore';

export const AdminHeader = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const { settings, fetchSettings } = useAdminSettingsStore();

    const isAuthenticated = !!user;

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchSettings();
        }
    }, [loading, isAuthenticated, fetchSettings]);

    if (!user) {
        return (
            <div className="text-center p-2">
                Cargando...
            </div>
        );
    }

    const choirName = (user as any).choirName || '';
    const choirCode = (user as any).choirCode || '';
    const choirLabel = choirName || choirCode || 'Coro asignado';

    return (
        <header className="layout-header my-0 py-3">
            <div className="titulo-nav px-0 d-flex flex-column">
                <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                    <div className="titulo text-center text-md-start">
                        <h1 className="mb-1 mb-lg-0 d-flex flex-column flex-md-row align-items-md-center fs-2 fw-bold">
                            <span>
                                {settings?.webTitle ? settings.webTitle : 'Company'} - Admin
                            </span>

                            <span className="ms-0 ms-md-3 mb-2">
                                <Badge className="fw-bold badge_bg">
                                    Coro:&nbsp;
                                    <span className="fw-semibold">
                                        {choirLabel}
                                        {choirName && choirCode ? ` (${choirCode})` : ''}
                                    </span>
                                </Badge>
                            </span>
                        </h1>
                    </div>

                    <div className="d-flex align-items-center justify-content-between justify-content-lg-end gap-3 mt-3 mt-md-0">
                        <p className="titulo mb-1 text-center fs-4 text-md-end">
                            ¡Hola {formatName(user.name)}!
                        </p>

                        <div className="d-flex flex-row gap-3 align-items-center">
                            <Button
                                variant="link"
                                title="Abrir chat grupal"
                                onClick={() => navigate('/admin/chat-group')}
                                className="p-0 m-0 border-0 d-flex align-items-center"
                            >
                                <FontAwesomeIcon
                                    icon={faComments}
                                    className="chat-msg-icon"
                                    style={{ fontSize: '1.8rem', color: 'purple' }}
                                />
                            </Button>

                            <div className="d-flex align-items-center">
                                <UserMenu />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
