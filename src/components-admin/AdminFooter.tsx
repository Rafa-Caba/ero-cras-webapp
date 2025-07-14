import { Link } from 'react-router-dom';
import '../assets/styles/components/_footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSettingsStore } from '../store/admin/useSettingsStore';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AdminFooter = () => {
    const { isAuthenticated, loading } = useAuth();
    const { settings, fetchSettings } = useSettingsStore();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            fetchSettings();
        }
    }, [loading, isAuthenticated]);

    return (
        <footer className="layout-footer color-footer">
            <div className="my-1 d-flex flex-column flex-md-row justify-content-between mb-2">
                <div className="copyright" style={{ marginLeft: '1em', marginTop: '4px' }}>
                    <p className="text-theme-color mb-2">Creada por Rafael Cabanillas - 2022</p>
                </div>
                <div style={{ marginRight: '1em' }} className='mb-3 mb-md-0'>
                    <ul className="nav w-100 order-1 d-flex justify-content-center">
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socialLinks.facebook ? settings.socialLinks.facebook : 'https://www.facebook.com/eroCrasCoro/'}
                            >
                                <FontAwesomeIcon icon={['fab', 'facebook']} />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socialLinks.instagram ? settings.socialLinks.instagram : 'https://instagram.com/ero.cras?utm_medium=copy_link'}
                            >
                                <FontAwesomeIcon icon={['fab', 'instagram']} />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socialLinks.youtube ? settings.socialLinks.youtube : 'https://youtube.com/channel/UCjh7iTV-ddkSxaLi7A1FJgA'}
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
