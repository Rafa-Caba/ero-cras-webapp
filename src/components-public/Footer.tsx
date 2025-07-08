import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePublicSettingsStore } from '../store/public/usePublicSettingsStore';
import '../assets/styles/components/_footer.scss';

export const Footer = () => {
    const { settings, fetchSettingsPublicos } = usePublicSettingsStore();

    useEffect(() => {
        fetchSettingsPublicos();
    }, []);

    return (
        <footer className="layout-footer">
            <div className="footer my-2 d-flex flex-column flex-md-row justify-content-between">
                <div className="copyright ms-0 ms-md-3">
                    <p className="text-black-50 mb-2">Creada por Rafael Cabanillas - 2022</p>
                </div>
                <div className='mb-3 mb-md-0 me-0 me-md-3'>
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