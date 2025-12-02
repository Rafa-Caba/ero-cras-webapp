import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { FaImage } from "react-icons/fa";
import LogoutButton from './LogoutButton';
import { useAuth } from '../../context/AuthContext';
import { useGalleryStore } from '../../store/admin/useGalleryStore';

export const AdminDashboardPanel = () => {
    const navigate = useNavigate();

    const { images, fetchGallery } = useGalleryStore();
    const { user, isAdmin, canEdit } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/auth/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        fetchGallery();
    }, []);

    const startImage = images.find(img => img.imageStart);

    return (
        <div className="d-flex flex-column pt-2 pb-1 px-1 px-md-5 mt-1">
            <p className="m-3 text-center fs-1 fw-bold">Panel de Control</p>

            <div className="panel-titulo d-flex justify-content-between flex-grow-1 flex-column mb-1">
                <div className='d-flex flex-column justify-content-center mb-3'>
                    <div className='d-flex justify-content-center flex-wrap mb-2'>
                        <Link to="/admin/songs" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Cantos
                        </Link>
                        <Link to="/admin/gallery" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Galería
                        </Link>

                        {isAdmin && (
                            <>
                                <Link to="/admin/users" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                                    Usuarios
                                </Link>

                                <Link to="/admin/logs" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                                    Logs del sitio
                                </Link>
                            </>
                        )}

                        {canEdit && (
                            <>
                                <Link to="/admin/song-types" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                                    Tipos de Cantos
                                </Link>
                                <Link to="/admin/members" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                                    Miembros
                                </Link>
                                <Link to="/admin/announcements" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                                    Admin Avisos
                                </Link>
                                <Link to="/admin/blog" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                                    Admin Blogs
                                </Link>
                                <Link to="/admin/settings" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                                    Ajustes de Pagina
                                </Link>
                                <Link to="/admin/themes" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                                    Temas de Color
                                </Link>

                            </>
                        )}

                        <Link className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2" to="/?fromAdmin=true">
                            Página Pública
                        </Link>
                    </div>
                </div>

                <div className={`${!startImage && 'imagen-inicio-container'} text-center my-3 mt-auto fade-in`}>
                    {startImage ? (
                        <Image
                            src={startImage.imageUrl}
                            alt={startImage.title || 'Start Image'}
                            fluid
                            style={{
                                width: '100%',
                                maxHeight: '80vh',
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

                <LogoutButton />
            </div>
        </div>
    );
};