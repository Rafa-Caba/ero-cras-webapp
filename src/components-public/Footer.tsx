import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/components/_footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Footer: React.FC = () => {
    return (
        <>
            <footer className="footer row">
                <div className="footer my-2 d-flex flex-column flex-md-row justify-content-between">
                    <div className="copyright" style={{ marginLeft: '1em', marginTop: '4px' }}>
                        <p className="text-black-50 mb-2">Creada por Rafael Cabanillas - 2022</p>
                    </div>
                    <div style={{ marginRight: '1em' }}>
                        <ul className="nav w-100 order-1 d-flex justify-content-center">
                            <li className="nav-item">
                                <Link className="nav-link redes" to="https://www.facebook.com/eroCrasCoro/">
                                    <FontAwesomeIcon icon={['fab', 'facebook']} />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link redes" to="https://instagram.com/ero.cras?utm_medium=copy_link">
                                    <FontAwesomeIcon icon={['fab', 'instagram']} />
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link redes" to="https://youtube.com/channel/UCjh7iTV-ddkSxaLi7A1FJgA">
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
        </>
    );
};

export default Footer;
