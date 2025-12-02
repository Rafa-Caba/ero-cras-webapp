import { Link } from 'react-router-dom'

export const AdminNav = () => {
    return (
        <nav className="layout-nav d-flex">
            <ul className="nav w-100 nav-pills nav-fill align-items-center justify-content-center">
                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                    <li className="nav-item">
                        <Link className="nav-link general_btn" style={{ fontWeight: "bold", paddingLeft: '2rem', paddingRight: '2rem' }} to="/admin">
                            Inicio
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link general_btn" style={{ fontWeight: "bold", paddingLeft: '2rem', paddingRight: '2rem' }} to="/admin/blog/view">
                            Blog
                        </Link>
                    </li>
                </div>
            </ul>
        </nav>
    );
};
