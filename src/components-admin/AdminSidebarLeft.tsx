import { Image } from "react-bootstrap";
import { FaImage } from "react-icons/fa";
import { useGaleriaStore } from "../store/admin/useGaleriaStore";
import { AvisosSidebar } from "../components/announcements/AnnouncementSidebar";
import { useWindowWidth } from "../hooks/useWindowWidth";

export const AdminSidebarLeft = () => {
    const { imagenes } = useGaleriaStore();
    const width = useWindowWidth();
    
    const imagenLeftMenu = imagenes.find(img => img.imagenLeftMenu);
    const breakPoint = width > 780;

    return (
        <aside className="layout-menu-izquierdo sidebar d-flex flex-column align-items-center order-1 order-lg-0">
            <div className={ breakPoint ? "my-3 w-75" : "my-0 w-75"}>
                { breakPoint &&
                    <div className={`${!imagenLeftMenu && 'imagen-left-container'} text-center`}>
                        {imagenLeftMenu ? (
                            <div className="d-none d-lg-block text-center mb-3">
                                <Image
                                    src={imagenLeftMenu.imagenUrl}
                                    alt={imagenLeftMenu.titulo}
                                    height={220}
                                    // width={140}
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

                {/* <AvisosSidebar /> */}
                <div className="w-100 avisos-scrollbox">
                    <AvisosSidebar />
                </div>
            </div>
        </aside>
    );
};