import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSettingsStore } from '../../store/public/useSettingsStore';
import '../../assets/styles/components/_footer.scss';

export const Footer = () => {
    const { settings, fetchSettings } = useSettingsStore();

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <footer className="layout-footer">
            <div className="footer my-2 d-flex flex-column flex-md-row justify-content-between">
                <div className="copyright ms-0 ms-md-3">
                    <p className="text-theme-color mb-2">Creada por Rafael Cabanillas - 2022</p>
                </div>
                <div className='mb-3 mb-md-0 me-0 me-md-3'>
                    <ul className="nav w-100 order-1 d-flex justify-content-center">
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socials.facebook ? settings.socials.facebook : 'https://www.facebook.com/eroCrasCoro/'}
                            >
                                <FontAwesomeIcon icon={['fab', 'facebook']} />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socials.instagram ? settings.socials.instagram : 'https://instagram.com/ero.cras?utm_medium=copy_link'}
                            >
                                <FontAwesomeIcon icon={['fab', 'instagram']} />
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link redes"
                                to={settings?.socials.youtube ? settings.socials.youtube : 'https://youtube.com/channel/UCjh7iTV-ddkSxaLi7A1FJgA'}
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