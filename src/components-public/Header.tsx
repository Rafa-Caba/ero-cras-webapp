

import { useLocation, Link } from 'react-router-dom';
import '../assets/styles/components/_header.scss';

export const Header = () => {
    const location = useLocation();
    const fromAdmin = new URLSearchParams(location.search).get('fromAdmin') === 'true';

    return (
        <header className="layout-header">
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
            </div>
        </header>
    );
};