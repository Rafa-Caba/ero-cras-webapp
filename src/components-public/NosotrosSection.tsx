import { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { FaImage } from 'react-icons/fa';
import { usePublicGaleriaStore } from '../store/public/usePublicGaleriaStore';
import { usePublicSettingsStore } from '../store/public/usePublicSettingsStore';

const NosotrosSection = () => {
    const { settings, fetchSettingsPublicos } = usePublicSettingsStore();
    const { imagenes } = usePublicGaleriaStore();

    const imagenNosotros = imagenes.find(img => img.imagenNosotros);

    useEffect(() => {
        fetchSettingsPublicos();
    }, []);

    return (
        <section className="center col-12 d-flex flex-column align-items-center order-0 order-md-1">
            <div className="nosotros galeria my-3 mx-0 mx-md-2">
                <div className="nosotros p-1">
                    <p className="fs-3 fw-bolder">Historia...</p>

                    <p className="lh-base fs-5 mx-2" id="bio">{settings?.historiaNosotros ? settings.historiaNosotros : 'No hay historia agregada.'}</p>
                </div>

                <div className={`${!imagenNosotros && 'imagen-nosotros-container'} text-center my-3 mt-auto fade-in`}>
                    {imagenNosotros ? (
                        <Image
                            src={imagenNosotros.imagenUrl}
                            alt={imagenNosotros.titulo}
                            height={380}
                            width={650}
                            className="imagen-fija-inicio"
                        />
                    ) : (
                        <div className="text-muted d-flex flex-column align-items-center">
                            <FaImage size={100} color="#ccc" />
                            <p className="mt-2">No hay imagen de inicio aún</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default NosotrosSection;
