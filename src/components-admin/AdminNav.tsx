import { Link } from 'react-router-dom'

export const AdminNav = () => {
    return (
        <nav className="layout-nav d-flex">
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
    );
};
