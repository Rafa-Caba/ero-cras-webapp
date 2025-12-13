import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Card, Row, Col } from 'react-bootstrap';
import { FaImage } from 'react-icons/fa';

import LogoutButton from './LogoutButton';
import { useAuth } from '../../context/AuthContext';
import { useGalleryStore } from '../../store/admin/useGalleryStore';
import { useUsersStore } from '../../store/admin/useUsersStore';
import { useThemeStore } from '../../store/admin/useThemeStore';
import type { Choir } from '../../types/choir';
import { useChoirsStore } from '../../store/admin/useChoirsStore';

type StatCardProps = {
    title: string;
    value: number | string;
    subtitle?: string;
    children?: React.ReactNode;
};

const StatCard = ({ title, value, subtitle, children }: StatCardProps) => (
    <Card className="shadow-sm dashboard-stat-card h-100">
        <Card.Body className="d-flex flex-column justify-content-between">
            <div>
                <Card.Title className="mb-1">{title}</Card.Title>
                <div className="fs-3 fs-md-2 fw-bold">{value}</div>
                {subtitle && (
                    <small className="text-muted d-block mt-1">{subtitle}</small>
                )}
            </div>
            {children && <div className="mt-2 sub_title">{children}</div>}
        </Card.Body>
    </Card>
);

export const AdminDashboardPanel = () => {
    const navigate = useNavigate();

    const { images, fetchGallery } = useGalleryStore();
    const { user, isSuperAdmin } = useAuth();

    const { users, fetchUsers } = useUsersStore();
    const { themes, fetchThemes } = useThemeStore();
    const { choirs, fetchChoirs } = useChoirsStore();

    useEffect(() => {
        if (!user) {
            navigate('/auth/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    useEffect(() => {
        fetchUsers(1).catch(() => undefined);
    }, [fetchUsers]);

    useEffect(() => {
        fetchThemes().catch(() => undefined);
    }, [fetchThemes]);

    useEffect(() => {
        if (isSuperAdmin) {
            fetchChoirs().catch(() => undefined);
        }
    }, [isSuperAdmin, fetchChoirs]);

    const startImage = images.find((img) => img.imageStart);

    const choirName = user?.choirName ?? user?.choirId;

    const choirsList: Choir[] = Array.isArray(choirs) ? choirs : [];
    const choirsPreview: Choir[] = choirsList.slice(0, 4);
    const extraChoirs =
        choirsList.length > choirsPreview.length
            ? choirsList.length - choirsPreview.length
            : 0;

    return (
        <div className="d-flex flex-column pt-2 pb-1 px-1 px-md-3 mt-0">
            <p className="m-3 mt-1 text-center fs-2 fw-bold">Panel de Control</p>

            {/* STATS ROW */}
            <Row className="mb-1 mb-md-3 g-3">
                <Col xs={6} md={3}>
                    <StatCard
                        title="Usuarios del coro"
                        value={users.length}
                        subtitle="En esta administración"
                    />
                </Col>

                <Col xs={6} md={3}>
                    <StatCard
                        title="Temas de color"
                        value={themes.length}
                        subtitle="Disponibles para este sitio"
                    />
                </Col>

                <Col xs={6} md={3}>
                    <StatCard
                        title="Imágenes en galería"
                        value={images.length}
                        subtitle="Inicio, menús y galería"
                    />
                </Col>

                {isSuperAdmin && (
                    <Col xs={6} md={3}>
                        <StatCard
                            title="Coros configurados"
                            value={choirsList.length}
                        >
                            {choirsList.length === 0 && (
                                <span className="text-muted">
                                    Aún no hay coros registrados.
                                </span>
                            )}

                            {choirsList.length > 0 && (
                                <ul className="list-unstyled mb-0">
                                    {choirsPreview.map((c: Choir) => (
                                        <li key={c.id}>• {c.name}</li>
                                    ))}
                                    {extraChoirs > 0 && (
                                        <li className="text-muted">
                                            +{extraChoirs} más…
                                        </li>
                                    )}
                                </ul>
                            )}
                        </StatCard>
                    </Col>
                )}
            </Row>

            {/* MAIN CONTENT (image + footer row) */}
            <div className="panel-titulo d-flex flex-column my-0 flex-grow-1">
                <div
                    className={`${!startImage && 'imagen-inicio-container'
                        } text-center mx-auto mt-3 fade-in`}
                >
                    {startImage ? (
                        <Image
                            src={startImage.imageUrl}
                            alt={startImage.title || 'Start Image'}
                            fluid
                            style={{
                                width: '100%',
                                maxHeight: '40vh',
                                objectFit: 'contain'
                            }}
                            className="imagen-fija-inicio mt-3"
                        />
                    ) : (
                        <div className="text-muted d-flex flex-column align-items-center">
                            <FaImage size={100} color="#ccc" />
                            <p className="mt-2">No hay imagen de inicio aún</p>
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-5">
                    <div className="small text-muted">
                        Coro actual:{' '}
                        <span className="fw-semibold">{choirName}</span>
                    </div>
                    <LogoutButton />
                </div>
            </div>
        </div>
    );
};
