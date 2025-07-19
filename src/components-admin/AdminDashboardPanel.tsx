import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { FaImage } from "react-icons/fa";
import LogoutButton from './LogoutButton';
import { useGaleriaStore } from '../store/admin/useGaleriaStore';
import { useAuth } from '../hooks/useAuth';

export const AdminDashboardPanel = () => {
    const navigate = useNavigate();

    const { imagenes } = useGaleriaStore();
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/admin/login');
        }
    }, [user, navigate]);

    const imagenInicio = imagenes.find(img => img.imagenInicio);

    return (
        <div className="d-flex flex-column pt-2 pb-1 px-1 px-md-5 mt-1">
            <p className="m-3 text-center fs-1 fw-bold">Panel de Control</p>

            <div className="panel-titulo d-flex justify-content-between flex-grow-1 flex-column mb-1">
                <div className='d-flex flex-column justify-content-center mb-3'>
                    <div className='d-flex justify-content-center flex-wrap mb-2'>
                        <Link to="/admin/users" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Usuarios
                        </Link>
                        <Link to="/admin/cantos" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Cantos
                        </Link>
                        <Link to="/admin/tipos-canto" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Tipos de Cantos
                        </Link>
                        <Link to="/admin/gallery" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Galería
                        </Link>
                        <Link to="/admin/members" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Miembros
                        </Link>
                        <Link to="/admin/blogposts" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Blogs
                        </Link>
                        <Link to="/admin/announcements" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Avisos
                        </Link>
                        <Link to="/admin/theme-groups" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Temas de Color
                        </Link>
                        <Link to="/admin/website_settings" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Ajustes de Pagina
                        </Link>
                        <Link to="/admin/logs-page" className="btn general_btn mb-2 mb-xxxl-0 py-1 px-3 me-2">
                            Logs del sitio
                        </Link>
                    </div>
                    {/* <div className='d-flex justify-content-center'>
                        <Link to={`/admin/chat-group`} className="btn general_btn py-1 px-3 me-2">
                            Chat de Grupo
                        </Link>
                    </div> */}
                </div>

                <div className={`${!imagenInicio && 'imagen-inicio-container'} text-center my-3 mt-auto fade-in`}>
                    {imagenInicio ? (
                        <Image
                            src={imagenInicio.imagenUrl}
                            alt={imagenInicio.titulo}
                            height={500}
                            width={600}
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
