import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../assets/styles/components/_footer.scss';
import { useAuth } from '../../context/AuthContext';
import { useAdminSettingsStore } from '../../store/admin/useSettingsStore';
import { useWindowWidth } from '../../hooks/useWindowWidth';

export const AdminFooter = () => {
    const { user, loading } = useAuth();
    const { settings, fetchSettings } = useAdminSettingsStore();
    const width = useWindowWidth();
    const isDesktop = width > 780;

    const isAuthenticated = !!user;

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchSettings();
        }
    }, [loading, isAuthenticated]);

    return (
        <footer className="layout-footer color-footer">
            <div className="d-flex flex-column flex-md-row justify-content-between my-2">
                <div className="copyright" style={{ marginLeft: isDesktop ? '1em' : 0, marginTop: '4px' }}>
                    <p className="text-theme-color mb-2">Creada por Rafael Cabanillas - 2022</p>
                </div>
                <div style={{ marginRight: isDesktop ? '1em' : 0 }} className='mb-3 mb-md-0'>
                    <ul className="nav w-100 order-1 d-flex justify-content-center">
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socials.facebook ? settings.socials.facebook : '/'}
                            >
                                <FontAwesomeIcon icon={['fab', 'facebook']} />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socials.instagram ? settings.socials.instagram : '/'}
                            >
                                <FontAwesomeIcon icon={['fab', 'instagram']} />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socials.youtube ? settings.socials.youtube : '/'}
                            >
                                <FontAwesomeIcon icon={['fab', 'youtube']} />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link redes" to="/contact">
                                <FontAwesomeIcon icon={['fas', 'envelope']} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};