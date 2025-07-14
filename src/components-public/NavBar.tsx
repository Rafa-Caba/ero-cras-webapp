import { Link } from "react-router-dom"

export const NavBar = () => {
    return (
        <nav className="layout-nav d-flex">
            <ul className="nav w-100 nav-pills nav-fill">
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/">Inicio</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/miembros">Miembros</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/misa">Misa Cantos</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/nosotros">Nosotros</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-theme-color" to="/contact">Contacto</Link>
                </li>
            </ul>
        </nav>
    )
}
