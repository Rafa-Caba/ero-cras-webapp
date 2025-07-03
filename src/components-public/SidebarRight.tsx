import { Image } from "react-bootstrap";
import { useGaleriaStore } from "../store/useGaleriaStore";
import { FaImage } from "react-icons/fa";


export const SidebarRight = () => {
    const { imagenes } = useGaleriaStore();
    const imagenRightMenu = imagenes.find(img => img.imagenRightMenu);

    return (
        <aside className="layout-menu-derecho d-flex flex-column align-content-start order-1 order-md-2">
            <div className="my-3">
                <div className="imagen-right-container text-center">
                    {imagenRightMenu ? (
                        <Image
                            src={imagenRightMenu.imagenUrl}
                            alt={imagenRightMenu.titulo}
                            height={200}
                            width={140}
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