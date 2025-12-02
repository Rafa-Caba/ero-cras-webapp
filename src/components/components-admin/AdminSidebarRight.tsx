import { Image } from 'react-bootstrap';
import { useGalleryStore } from '../../store/admin/useGalleryStore';
import { FaImage } from 'react-icons/fa';
import { useWindowWidth } from '../../hooks/useWindowWidth';

export const AdminSidebarRight = () => {
    const { images } = useGalleryStore();
    const width = useWindowWidth();

    const rightMenuImage = images.find(img => img.imageRightMenu);

    const isDesktop = width > 780;

    return (
        <aside className="layout-menu-derecho sidebar col-12 col-lg-2 d-flex flex-column align-content-start order-2 order-lg-2 d-none d-lg-block">
            <div className={isDesktop ? "my-3 w-100" : "my-0 w-75"}>
                <div className={`${!rightMenuImage && 'imagen-right-container'} text-center`}>
                    {rightMenuImage ? (
                        <div className="text-center mb-3">
                            <Image
                                src={rightMenuImage.imageUrl}
                                alt={rightMenuImage.title || 'Right Menu Image'}
                                style={{
                                    width: '100%',
                                    maxHeight: '12vh',
                                    objectFit: 'contain'
                                }}
                                className="imagen-fija-right-menu"
                            />
                        </div>
                    ) : (
                        <div className="text-muted d-flex flex-column align-items-center">
                            <FaImage size={80} color="#ccc" />
                            <p className="mt-2 fs-6">No hay imagen seleccionada aún</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};