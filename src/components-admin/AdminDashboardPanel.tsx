import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useGaleriaStore } from '../store/useGaleriaStore';
import { Image } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

export const AdminDashboardPanel = () => {
    const navigate = useNavigate();

    const { imagenes } = useGaleriaStore();
    const { user } = useAuth();

    if (!user) {
        navigate('/admin/login');
        return;
    }

    const imagenDestacada = imagenes.find(img => img.destacada);

    return (
        <div className="d-flex flex-column py-3 px-3 px-md-5 mt-1">
            <p className="m-3 text-center fs-1 fw-bold">Panel de Control</p>

            <div className="panel-titulo d-flex justify-content-between flex-grow-1 flex-column mb-2">
                <div className='d-flex flex-column justify-content-center mb-2'>
                    <div className='d-flex justify-content-center flex-wrap mb-2'>
                        <Link to="/admin/users" className="btn general_btn mb-2 mb-md-0 py-1 px-3 me-2">
                            Usuarios
                        </Link>
                        <Link to="/admin/cantos" className="btn general_btn mb-2 mb-md-0 py-1 px-3 me-2">
                            Cantos
                        </Link>
                        <Link to="/admin/gallery" className="btn general_btn mb-2 mb-md-0 py-1 px-3 me-2">
                            Galería
                        </Link>
                        <Link to="/admin/members" className="btn general_btn mb-2 mb-md-0 py-1 px-3 me-2">
                            Miembros
                        </Link>
                        <Link to="/admin/avisos" className="btn general_btn mb-2 mb-md-0 py-1 px-3 me-2">
                            Avisos
                        </Link>
                        <Link to="/admin/themes" className="btn general_btn py-1 px-3 me-2">
                            Temas de Color
                        </Link>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <Link to={`/admin/chat/${user!._id || ''}`} className="btn general_btn py-1 px-3 me-2">
                            Chat de Grupo
                        </Link>
                    </div>
                </div>

                <div className="imagen-inicio-contenedor text-center my-2 mt-auto">
                    {imagenDestacada ? (
                        <Image
                            src={imagenDestacada.imagenUrl}
                            alt={imagenDestacada.titulo}
                            height={650}
                            width={650}
                            className="imagen-fija mt-3"
                        />
                    ) : (
                        <p>No hay imagen destacada aún</p>
                    )}
                </div>

                <LogoutButton />
            </div>
        </div>
    );
};
