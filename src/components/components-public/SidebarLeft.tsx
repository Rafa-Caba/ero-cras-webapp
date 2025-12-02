import { Image } from "react-bootstrap";
import { FaImage } from "react-icons/fa";
import { useGalleryStore } from "../../store/public/useGalleryStore";

export const SidebarLeft = () => {
    const { images } = useGalleryStore();

    const leftMenuImage = images.find(img => img.imageLeftMenu);

    return (
        <aside className="layout-menu-izquierdo sidebar d-flex flex-column align-items-center order-2 order-md-0">
            <div className="my-3">
                <div className={`${!leftMenuImage && 'imagen-left-container'} text-center d-none d-md-block`}>
                    {leftMenuImage ? (
                        <Image
                            src={leftMenuImage.imageUrl}
                            alt={leftMenuImage.title}
                            style={{
                                width: '100%',
                                maxHeight: '12vh',
                                objectFit: 'contain'
                            }}
                            className="imagen-fija-left-menu"
                        />
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