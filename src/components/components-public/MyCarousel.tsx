import { useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { FaImage } from 'react-icons/fa';
import { useGalleryStore } from '../../store/public/useGalleryStore';

export const MyCarousel = () => {
    const { images, fetchGallery } = useGalleryStore();

    useEffect(() => {
        fetchGallery();
    }, []);

    const isMobileOrTablet = useMediaQuery({ maxWidth: 768 });

    return (
        <div className={`${images.length === 0 && 'images-carousel'} my-3`}>
            <Carousel fade indicators controls>
                {images.length > 0
                    ? (images.map((image) => (
                        image.imageGallery && (
                            <Carousel.Item key={image.id} className="w-100">
                                <img
                                    loading="lazy"
                                    className="imagen-fija-carousel w-100"
                                    src={image.imageUrl}
                                    alt={image.title}
                                    height={isMobileOrTablet ? undefined : 750}
                                    width={isMobileOrTablet ? 650 : undefined}
                                    style={{ objectFit: 'cover' }}
                                />
                                <Carousel.Caption>
                                    <h5>{image.title}</h5>
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