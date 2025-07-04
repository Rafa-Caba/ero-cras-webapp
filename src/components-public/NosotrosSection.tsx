import { Image } from 'react-bootstrap';
import { useGaleriaStore } from '../store/useGaleriaStore';
import { FaImage } from 'react-icons/fa';

const NosotrosSection = () => {
    const { imagenes } = useGaleriaStore();
    const imagenNosotros = imagenes.find(img => img.imagenNosotros);

    return (
        <section className="center col-12 d-flex flex-column align-items-center order-0 order-md-1">
            <div className="nosotros galeria my-3 mx-0 mx-md-2">
                <div className="nosotros p-1">
                    <p className="fs-3 fw-bolder">Historia...</p>

                    <p className="d-none d-md-block lh-base fs-5 mx-2" id="bio">
                        All started back in March 2014. There was a need for a choir at the San José chapel but there was no one to take that place to sing
                        the Masses that were celebrated in there. So, one day, when the San José's feasts were taking place, most of the current members sat
                        down along with other current ex-members and decided we would be taking that option of becoming the official choir in that Chapel to
                        accompany the ceremonies celebrated there.<br />
                        Time went by and members started to leave the choir and others joined. It's been 6 years and 4 months and we're still singing the Mass at San José's Chapel.
                    </p>

                    <p className="d-block d-md-none lh-sm" id="bio">
                        All started back in March 2014. There was a need for a choir at the San José chapel but there was no one to take that place to sing
                        the Masses that were celebrated in there. So, one day, when the San José's feasts were taking place, most of the current members sat
                        down along with other current ex-members and decided we would be taking that option of becoming the official choir in that Chapel to
                        accompany the ceremonies celebrated there.<br />
                        Time went by and members started to leave the choir and others joined. It's been 6 years and 4 months and we're still singing the Mass at San José's Chapel.
                    </p>
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
