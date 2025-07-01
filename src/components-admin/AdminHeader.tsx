import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

export const AdminHeader = () => {

    const { user } = useAuth();

    if (!user) {
        return (
            <div className="text-center p-2">
                Cargando...
            </div>
        );
    }

    return (
        <header className="row">
            <div className="titulo-nav px-0 col-12 d-flex flex-column">
                <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                    <div className="titulo text-center text-md-start">
                        <h1>Ero Cras - Admin</h1>
                    </div>
                    <div className="contador_visitas d-flex flex-row align-items-center">
                        <p className="titulo mb-1 text-center fs-2 text-md-end">¡Hola {user.nombre}!</p>
                        <Image
                            src={user.fotoPerfilUrl || '/images/default-user.png'}
                            roundedCircle
                            height={50}
                            width={50}
                            alt={user.nombre}
                            style={{
                                objectFit: 'cover',
                                width: '60px',
                                height: '60px',
                                minWidth: '60px',
                                minHeight: '60px',
                                border: '1px solid black',
                                margin: '.3rem'
                            }}
                        />
                    </div>
                </div>

                <nav className="navbar w-100 d-flex">
                    <ul className="nav w-100 nav-pills nav-fill">
                        <li className="nav-item">
                            <Link className="nav-link text-black" to="/?fromAdmin=true">
                                Ero Cras Inicio
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-black" to="/miembros?fromAdmin=true">
                                Miembros
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-black" to="/misa-erocras?fromAdmin=true">
                                Misa Ero Cras
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-black" to="/nosotros?fromAdmin=true">
                                Nosotros
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link text-black" to="/contact?fromAdmin=true">
                                Contacto
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

