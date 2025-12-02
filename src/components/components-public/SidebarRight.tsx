import { Image } from "react-bootstrap";
import { FaImage } from "react-icons/fa";
import { useGalleryStore } from "../../store/public/useGalleryStore";

export const SidebarRight = () => {
    const { images } = useGalleryStore();

    const rightMenuImage = images.find(img => img.imageRightMenu);

    return (
        <aside className="layout-menu-derecho sidebar d-flex flex-column align-content-start order-1 order-md-2">
            <div className="my-3">
                <div className={`${!rightMenuImage && 'imagen-right-container'} text-center`}>
                    {rightMenuImage ? (
                        <Image
                            src={rightMenuImage.imageUrl}
                            alt={rightMenuImage.title}
                            style={{
                                width: '100%',
                                maxHeight: '12vh',
                                objectFit: 'contain'
                            }}
                            className="imagen-fija-right-menu"
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