import { Link } from "react-router-dom"

export const NavBar = () => {
    return (
        <nav className="layout-nav d-flex">
            <ul className="nav w-100 nav-pills nav-fill">
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/">Inicio</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/members">Miembros</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/songs">Misa Cantos</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/about">Nosotros</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/contact">Contacto</Link>
                </li>
            </ul>
        </nav>
    )
}
