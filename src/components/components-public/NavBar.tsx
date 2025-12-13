import { Link, useLocation } from "react-router-dom";

export const NavBar = () => {
    const location = useLocation();

    // Extract first segment as choirKey: /eroc1/members -> "eroc1"
    const match = location.pathname.match(/^\/([^/?#]+)/);
    const choirKey = match && match[1] ? match[1] : null;

    // Base prefix for routes
    const basePath = choirKey ? `/${choirKey}` : '';

    const homePath = choirKey ? `/${choirKey}` : '/';

    return (
        <nav className="layout-nav d-flex">
            <ul className="nav w-100 nav-pills nav-fill">
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to={homePath}>
                        Inicio
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className="nav-link text-theme-color"
                        to={`${basePath}/members`}
                    >
                        Miembros
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className="nav-link text-theme-color"
                        to={`${basePath}/songs`}
                    >
                        Cantos
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className="nav-link text-theme-color"
                        to={`${basePath}/about`}
                    >
                        Nosotros
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        className="nav-link text-theme-color"
                        to={`${basePath}/contact`}
                    >
                        Contacto
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
