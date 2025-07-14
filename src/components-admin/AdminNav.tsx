import { Link } from 'react-router-dom'

export const AdminNav = () => {
    return (
        <nav className="layout-nav d-flex">
            <ul className="nav w-100 nav-pills nav-fill">
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/?fromAdmin=true">
                        Inicio
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/miembros?fromAdmin=true">
                        Miembros
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/misa?fromAdmin=true">
                        Misa Cantos
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/nosotros?fromAdmin=true">
                        Nosotros
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/contact?fromAdmin=true">
                        Contacto
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/admin/blog_posts?fromAdmin=true">
                        Blog
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
