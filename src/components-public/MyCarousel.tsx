import { useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { FaImage } from 'react-icons/fa';
import { usePublicGaleriaStore } from '../store/public/usePublicGaleriaStore';

export const MyCarousel = () => {

    const { imagenes, fetchImagenesPublicas } = usePublicGaleriaStore();

    useEffect(() => {
        fetchImagenesPublicas();
    }, []);

    const isMobileOrTablet = useMediaQuery({ maxWidth: 768 });

    return (
        <div className={`${imagenes.length === 0 && 'images-carousel'} my-3`}>
            <Carousel fade indicators controls>
                {imagenes.length > 0
                    ? (imagenes.map((imagen) => (
                        imagen.imagenGaleria && (
                            <Carousel.Item key={imagen._id} className="w-100">
                                <img
                                    loading="lazy"
                                    className="imagen-fija-carousel w-100"
                                    src={imagen.imagenUrl}
                                    alt={imagen.titulo}
                                    height={isMobileOrTablet ? undefined : 750}
                                    width={isMobileOrTablet ? 650 : undefined}
                                    style={{ objectFit: 'cover' }}
                                />
                                <Carousel.Caption>
                                    <h5>{imagen.titulo}</h5>
                                </Carousel.Caption>
                            </Carousel.Item>
                        )
                    ))) : (
                        <div className="text-muted d-flex flex-column align-items-center">
                            <FaImage size={130} color="#ccc" />
                            <p className="mt-2">No hay imagenes en el carousel aún</p>
                        </div>
                    )
                }
            </Carousel>
        </div>
    );
};
