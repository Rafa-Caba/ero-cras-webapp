import { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../assets/styles/components/_header.scss';
import { usePublicSettingsStore } from '../store/public/usePublicSettingsStore';

export const Header = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const fromAdmin = new URLSearchParams(location.search).get('fromAdmin') === 'true';
    const { settings, fetchSettingsPublicos } = usePublicSettingsStore();

    useEffect(() => {
        fetchSettingsPublicos();
    }, []);

    const botonIrAdmin = () => {
        return (
            <button
                className='btn btn-outline-secondary fs-6 btn-sm fw-bold'
                onClick={() => navigate('/admin', { replace: true })}
            >
                Ir al admin
            </button>
        );
    };

    return (
        <header className="layout-header">
            <div className="titulo-nav px-0 col-12 d-flex flex-column">
                <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                    <div className="titulo text-center text-md-start">
                        <h1>{settings?.tituloWeb ? settings.tituloWeb : 'Company'} Oficial</h1>
                    </div>
                    {fromAdmin
                        ? (
                            <div className="text-end mt-2 mt-md-0">
                                <Link to="/admin" className="btn btn-outline-secondary btn-sm fw-bold">
                                    ← Volver al Admin
                                </Link>
                            </div>
                        ) : (
                            botonIrAdmin()
                        )
                    }
                </div>
            </div>
        </header>
    );
};