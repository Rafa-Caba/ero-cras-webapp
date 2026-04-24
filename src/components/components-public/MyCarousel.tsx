// src/components/components-public/MyCarousel.tsx

import { useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import { FaImage } from 'react-icons/fa';
import { Box, Paper, Typography } from '@mui/material';

import { useGalleryStore } from '../../store/public/useGalleryStore';

export const MyCarousel = () => {
    const { images, fetchGallery } = useGalleryStore();

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    const isMobileOrTablet = useMediaQuery({ maxWidth: 768 });
    const galleryImages = images.filter((image) => image.imageGallery);

    return (
        <Paper
            elevation={0}
            className={galleryImages.length === 0 ? 'images-carousel' : undefined}
            sx={{
                width: '100%',
                // height: '100%',
                my: {
                    xs: 1.5,
                    md: 2,
                },
                borderRadius: {
                    xs: 1.5,
                    md: 2,
                },
                overflow: 'hidden',
                backgroundColor: 'color-mix(in srgb, var(--color-card) 86%, transparent)',
                border: '1px solid color-mix(in srgb, var(--color-border) 84%, transparent)',
                boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)',
                color: 'var(--color-text)',
            }}
        >
            {galleryImages.length > 0 ? (
                <Carousel fade indicators controls>
                    {galleryImages.map((image) => (
                        <Carousel.Item key={image.id} className="w-100 h-100">
                            <Box
                                component="img"
                                loading="lazy"
                                className="imagen-fija-carousel w-100 h-100"
                                src={image.imageUrl}
                                alt={image.title}
                                sx={{
                                    width: '100%',
                                    height: {
                                        xs: 280,
                                        sm: 420,
                                        md: 560,
                                        lg: 680,
                                    },
                                    maxHeight: isMobileOrTablet ? 420 : 850,
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />

                            <Carousel.Caption>
                                <Typography
                                    component="h5"
                                    sx={{
                                        m: 0,
                                        fontWeight: 900,
                                        color: 'var(--color-button-text)',
                                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.45)',
                                    }}
                                >
                                    {image.title}
                                </Typography>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <Box
                    sx={{
                        minHeight: {
                            xs: 260,
                            md: 420,
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-secondary-text)',
                        textAlign: 'center',
                        px: 2,
                    }}
                >
                    <FaImage size={120} color="currentColor" />

                    <Typography
                        sx={{
                            mt: 2,
                            fontWeight: 800,
                        }}
                    >
                        No hay imágenes en el carrusel aún
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};