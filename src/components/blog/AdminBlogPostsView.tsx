// src/components/blog/AdminBlogPostsView.tsx

import { useEffect, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from '@mui/material';

import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

import { useBlogStore } from '../../store/admin/useBlogStore';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import { parseText } from '../../utils/handleTextTipTap';

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
}

const SectionHeader = ({ title, subtitle, icon }: SectionHeaderProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
                flexShrink: 0,
                p: {
                    xs: 1.5,
                    md: 2,
                },
                borderRadius: 2,
                background:
                    'linear-gradient(145deg, color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%) 0%, color-mix(in srgb, var(--color-card) 78%, transparent) 100%)',
                border: '1px solid color-mix(in srgb, var(--color-border) 38%, transparent)',
                boxShadow:
                    'inset 0 1px 0 color-mix(in srgb, var(--color-button-text) 14%, transparent), 0 12px 38px rgba(15, 23, 42, 0.06)',
                color: 'var(--color-text)',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: {
                        xs: 'center',
                        sm: 'flex-start',
                    },
                    gap: 1.25,
                    textAlign: {
                        xs: 'center',
                        sm: 'left',
                    },
                }}
            >
                <Box
                    sx={{
                        width: 44,
                        height: 44,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 1.5,
                        color: 'var(--color-button-text)',
                        background:
                            'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                        boxShadow:
                            '0 10px 24px rgba(15, 23, 42, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.24)',
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Box>

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        component="h1"
                        sx={{
                            m: 0,
                            fontSize: {
                                xs: '1.55rem',
                                md: '2rem',
                            },
                            fontWeight: 950,
                            lineHeight: 1.1,
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.4,
                            color: 'var(--color-secondary-text)',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export const AdminBlogPostsView = () => {
    const {
        posts,
        loading,
        fetchPosts,
    } = useBlogStore();

    useEffect(() => {
        fetchPosts().catch(() => {
            Swal.fire('Error', 'No se pudo cargar el post', 'error');
        });
    }, [fetchPosts]);

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    const publicPosts = [...posts].filter((post) => post.isPublic).reverse();

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 360,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--color-text)',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2, fontWeight: 800 }}>
                        Cargando publicaciones...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            component="section"
            sx={{
                width: '100%',
                minHeight: 0,
                height: '100%',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                overflow: 'hidden',
            }}
        >
            <SectionHeader
                title="Publicaciones"
                subtitle="Consulta las publicaciones públicas del blog."
                icon={<ArticleRoundedIcon />}
            />

            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    p: {
                        xs: 1.25,
                        md: 2,
                    },
                    borderRadius: 2,
                    background:
                        'linear-gradient(145deg, color-mix(in srgb, var(--color-card) 86%, var(--color-primary) 14%) 0%, color-mix(in srgb, var(--color-card) 76%, transparent) 100%)',
                    border: '1px solid color-mix(in srgb, var(--color-border) 38%, transparent)',
                    boxShadow:
                        'inset 0 1px 0 color-mix(in srgb, var(--color-button-text) 14%, transparent), 0 12px 42px rgba(15, 23, 42, 0.06)',
                    color: 'var(--color-text)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {publicPosts.length === 0 ? (
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: 'var(--color-secondary-text)',
                        }}
                    >
                        <MenuBookRoundedIcon sx={{ fontSize: 90 }} />

                        <Typography sx={{ mt: 1.5, fontWeight: 950 }}>
                            No hay publicaciones disponibles.
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflowY: 'auto',
                            overflowX: 'hidden',
                            pr: {
                                xs: 0,
                                md: 0.5,
                            },
                            '& .my-masonry-grid': {
                                display: 'flex',
                                width: 'auto',
                                ml: -2,
                            },
                            '& .my-masonry-grid_column': {
                                pl: 2,
                                backgroundClip: 'padding-box',
                            },
                            '& .my-masonry-grid_column > div': {
                                mb: 2,
                            },
                        }}
                    >
                        <Masonry
                            breakpointCols={{
                                default: 4,
                                1400: 3,
                                1100: 2,
                                700: 1,
                            }}
                            className="my-masonry-grid"
                            columnClassName="my-masonry-grid_column"
                        >
                            {publicPosts.map((post) => (
                                <motion.div
                                    key={post.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="show"
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            borderRadius: 2,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                                            border:
                                                '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                                            boxShadow:
                                                'inset 0 1px 0 color-mix(in srgb, var(--color-button-text) 12%, transparent), 0 10px 28px rgba(15, 23, 42, 0.05)',
                                            color: 'var(--color-text)',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {post.imageUrl && (
                                            <Box
                                                component="img"
                                                src={post.imageUrl}
                                                alt={post.title}
                                                sx={{
                                                    width: '100%',
                                                    height: 230,
                                                    objectFit: 'cover',
                                                    display: 'block',
                                                }}
                                            />
                                        )}

                                        <Box
                                            sx={{
                                                p: 1.5,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            <Typography
                                                component="h2"
                                                sx={{
                                                    m: 0,
                                                    fontSize: '1.15rem',
                                                    fontWeight: 950,
                                                    lineHeight: 1.15,
                                                    overflowWrap: 'anywhere',
                                                }}
                                            >
                                                {post.title}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    color: 'var(--color-secondary-text)',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 800,
                                                }}
                                            >
                                                Por {post.author?.name || 'Desconocido'}
                                            </Typography>

                                            <Box
                                                sx={{
                                                    maxHeight: 180,
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    color: 'var(--color-text)',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        height: 42,
                                                        background:
                                                            'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--color-card) 96%, var(--color-primary) 4%) 100%)',
                                                    },
                                                }}
                                            >
                                                {post.content && <TiptapViewer content={parseText(post.content)} />}
                                            </Box>

                                            <Divider
                                                sx={{
                                                    borderColor:
                                                        'color-mix(in srgb, var(--color-border) 36%, transparent)',
                                                }}
                                            />

                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 1,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1.25,
                                                        color: 'var(--color-secondary-text)',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    <Box
                                                        component="span"
                                                        title="Likes"
                                                        sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 0.4,
                                                        }}
                                                    >
                                                        <FavoriteRoundedIcon sx={{ fontSize: 18 }} />
                                                        {post.likes || 0}
                                                    </Box>

                                                    <Box
                                                        component="span"
                                                        title="Comentarios"
                                                        sx={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: 0.4,
                                                        }}
                                                    >
                                                        <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} />
                                                        {post.comments?.length || 0}
                                                    </Box>
                                                </Box>

                                                <Button
                                                    component={RouterLink}
                                                    to={`/admin/blog/view/${post.id}`}
                                                    variant="contained"
                                                    size="small"
                                                    sx={{
                                                        borderRadius: 1.5,
                                                        fontWeight: 950,
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    Leer más
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            ))}
                        </Masonry>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};