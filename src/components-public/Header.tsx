

import { useLocation, Link } from 'react-router-dom';
import '../assets/styles/components/_header.scss';

const Header = () => {
    const location = useLocation();
    const fromAdmin = new URLSearchParams(location.search).get('fromAdmin') === 'true';

    return (
        <header className="row">
            <div className="titulo-nav px-0 col-12 d-flex flex-column">
                <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                    <div className="titulo text-center text-md-start">
                        <h1>Ero Cras Oficial</h1>
                    </div>
                    {fromAdmin && (
                        <div className="text-end mt-2 mt-md-0">
                            <Link to="/admin" className="btn btn-outline-secondary btn-sm fw-bold">
                                ← Volver al Admin
                            </Link>
                        </div>
                    )}
                </div>
                <nav className="navbar w-100 d-flex">
                    <ul className="nav w-100 nav-pills nav-fill mr-5">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Ero Cras Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/miembros">Miembros</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/misa-erocras">Misa Ero Cras</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/nosotros">Nosotros</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/contact">Contacto</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;