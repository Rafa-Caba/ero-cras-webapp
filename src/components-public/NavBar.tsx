import { Link } from "react-router-dom"

export const NavBar = () => {
    return (
        <nav className="layout-nav d-flex">
            <ul className="nav w-100 nav-pills nav-fill">
                <li className="nav-item">
                    <Link className="nav-link text-black" to="/">Ero Cras Inicio</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-black" to="/miembros">Miembros</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-black" to="/misa-erocras">Misa Ero Cras</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-black" to="/nosotros">Nosotros</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-black" to="/contact">Contacto</Link>
                </li>
            </ul>
        </nav>
    )
}
