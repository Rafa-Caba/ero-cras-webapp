import { Image } from "react-bootstrap";
import { useGaleriaStore } from "../store/useGaleriaStore";
import { FaImage } from "react-icons/fa";

export const SidebarLeft = () => {
    const { imagenes } = useGaleriaStore();
    const imagenLeftMenu = imagenes.find(img => img.imagenLeftMenu);

    return (
        <aside className="layout-menu-izquierdo d-flex flex-column align-items-center order-2 order-md-0">
            <div className="my-3">
                <div className="imagen-left-container text-center">
                    {imagenLeftMenu ? (
                        <Image
                            src={imagenLeftMenu.imagenUrl}
                            alt={imagenLeftMenu.titulo}
                            height={200}
                            width={140}
                            className="imagen-fija-left-menu"
                        />
                    ) : (
                        <div className="text-muted d-flex flex-column align-items-center">
                            <FaImage size={80} color="#ccc" />
                            <p className="mt-2 fs-6">No hay imagen seleccionada aún</p>
                        </div>
                    )}
                </div>
                <div className='mt-4'>
                    <h3 className='fw-bold'>Noticias</h3>
                    <ul>
                        <li>Hoy es Dia del Amor (Jesus)</li>
                        <li>Nunca te olvides de Dios</li>
                        <li>Dios es Amor!!!</li>
                    </ul>

                </div>
            </div>
        </aside>
    );
};