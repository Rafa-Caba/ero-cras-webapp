// src/layouts/admin/AdminSidebarLeft.tsx

import {
    Box,
    Paper,
    Typography,
} from '@mui/material';

import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

import { useGalleryStore } from '../../store/admin/useGalleryStore';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import { AnnouncementSidebar } from '../announcements/AnnouncementSidebar';

export const AdminSidebarLeft = () => {
    const { images } = useGalleryStore();
    const width = useWindowWidth();

    const leftMenuImage = images.find((image) => image.imageLeftMenu);
    const isDesktop = width > 780;

    return (
        <Box
            component="aside"
            className="layout-menu-izquierdo sidebar order-1 order-lg-0"
            sx={{
                height: '100%',
                minHeight: 0,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: 'var(--color-text)',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    width: isDesktop ? '100%' : '75%',
                    height: '100%',
                    minHeight: 0,
                    my: isDesktop ? 1.5 : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.25,
                    overflow: 'hidden',
                }}
            >
                {isDesktop && (
                    <Paper
                        elevation={0}
                        className={!leftMenuImage ? 'imagen-left-container' : undefined}
                        sx={{
                            flexShrink: 0,
                            p: 1,
                            borderRadius: 2,
                            backgroundColor:
                                'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                            color: 'var(--color-text)',
                            textAlign: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        {leftMenuImage ? (
                            <Box
                                component="img"
                                src={leftMenuImage.imageUrl}
                                alt={leftMenuImage.title || 'Imagen del menú lateral'}
                                className="imagen-fija-left-menu"
                                sx={{
                                    width: '100%',
                                    maxHeight: '12vh',
                                    objectFit: 'contain',
                                    display: 'block',
                                }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    minHeight: 120,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-secondary-text)',
                                    gap: 0.75,
                                }}
                            >
                                <ImageRoundedIcon sx={{ fontSize: 64, opacity: 0.68 }} />

                                <Typography
                                    sx={{
                                        fontWeight: 800,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    No hay imagen seleccionada aún
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                )}

                <Box
                    className="w-100 avisos-scrollbox"
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        width: '100%',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    <AnnouncementSidebar />
                </Box>
            </Box>
        </Box>
    );
};