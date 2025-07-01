import { useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useGaleriaStore } from '../store/useGaleriaStore';

export const MyCarousel = () => {

    const { imagenes, fetchImagenes } = useGaleriaStore();

    useEffect(() => {
        if (imagenes.length === 0) {
            fetchImagenes();
        }
    }, []);

    return (
        <Carousel fade indicators controls>
            {imagenes.map((imagen) => (
                <Carousel.Item key={imagen._id} className="w-100">
                    <img
                        className="imagen-fija-carousel w-100"
                        src={imagen.imagenUrl}
                        alt={imagen.titulo}
                        height={630}
                        width={630}
                        style={{ objectFit: 'cover' }}
                    />
                    <Carousel.Caption>
                        <h5>{imagen.titulo}</h5>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};
