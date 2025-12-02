import { Image } from "react-bootstrap";
import { FaImage } from "react-icons/fa";
import { useGalleryStore } from "../../store/admin/useGalleryStore";
import { AvisosSidebar } from "../../components/announcements/AnnouncementSidebar";
import { useWindowWidth } from "../../hooks/useWindowWidth";

export const AdminSidebarLeft = () => {
    const { images } = useGalleryStore();
    const width = useWindowWidth();

    const leftMenuImage = images.find(img => img.imageLeftMenu);

    const isDesktop = width > 780;

    return (
        <aside className="layout-menu-izquierdo sidebar d-flex flex-column align-items-center order-1 order-lg-0">
            <div className={isDesktop ? "my-3 w-100" : "my-0 w-75"}>
                {isDesktop &&
                    <div className={`${!leftMenuImage && 'imagen-left-container'} text-center`}>
                        {leftMenuImage ? (
                            <div className="d-none d-lg-block text-center mb-3">
                                <Image
                                    src={leftMenuImage.imageUrl}
                                    alt={leftMenuImage.title || 'Left Menu Image'}
                                    style={{
                                        width: '100%',
                                        maxHeight: '12vh',
                                        objectFit: 'contain'
                                    }}
                                    className="imagen-fija-left-menu"
                                />
                            </div>
                        ) : (
                            <div className="text-muted d-flex flex-column align-items-center">
                                <FaImage size={80} color="#ccc" />
                                <p className="mt-2 fs-6">No hay imagen seleccionada aún</p>
                            </div>
                        )}
                    </div>
                }

                <div className="w-100 avisos-scrollbox">
                    <AvisosSidebar />
                </div>
            </div>
        </aside>
    );
};