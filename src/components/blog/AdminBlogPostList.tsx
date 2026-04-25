// src/components/blog/AdminBlogPostList.tsx

import { useEffect, useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { useBlogStore } from '../../store/admin/useBlogStore';

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    icon: ReactNode;
    action?: ReactNode;
}

const SectionHeader = ({ title, subtitle, icon, action }: SectionHeaderProps) => {
    return (
        <Paper
            elevation={0}
            sx={{
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
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: {
                        xs: 'column',
                        sm: 'row',
                    },
                    alignItems: {
                        xs: 'stretch',
                        sm: 'center',
                    },
                    justifyContent: 'space-between',
                    gap: 1.5,
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
                        }}
                    >
                        {icon}
                    </Box>

                    <Box>
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

                {action}
            </Box>
        </Paper>
    );
};

export const AdminBlogPostList = () => {
    const [search, setSearch] = useState('');

    const {
        posts,
        loading,
        fetchPosts,
        removePost,
    } = useBlogStore();

    useEffect(() => {
        void fetchPosts();
    }, [fetchPosts]);

    const filteredPosts = posts.filter((post) => {
        const titleMatches = post.title.toLowerCase().includes(search.toLowerCase());
        const authorMatches = (post.author?.name || '').toLowerCase().includes(search.toLowerCase());

        return titleMatches || authorMatches;
    });

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el post y su imagen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await removePost(id);
            Swal.fire('Eliminado', 'El post ha sido eliminado.', 'success');
        } catch {
            Swal.fire('Error', 'No se pudo eliminar el post', 'error');
        }
    };

    return (
        <Box
            component="section"
            sx={{
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <SectionHeader
                title="Posts del Blog"
                subtitle="Administra publicaciones, portada, estado, likes y comentarios."
                icon={<ArticleRoundedIcon />}
                action={
                    <Button
                        component={RouterLink}
                        to="/admin/blog/new"
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        sx={{
                            borderRadius: 1.5,
                            px: 2,
                            py: 0.9,
                            fontWeight: 950,
                        }}
                    >
                        Nuevo Post
                    </Button>
                }
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
                    gap: 1.5,
                }}
            >
                <TextField
                    type="text"
                    label="Buscar"
                    placeholder="Buscar por título o autor"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchRoundedIcon sx={{ color: 'var(--color-primary)' }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {loading ? (
                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 320,
                            display: 'grid',
                            placeItems: 'center',
                        }}
                    >
                        <Box sx={{ textAlign: 'center' }}>
                            <CircularProgress />
                            <Typography sx={{ mt: 2, fontWeight: 800 }}>
                                Cargando posts...
                            </Typography>
                        </Box>
                    </Box>
                ) : (
                    <TableContainer
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflow: 'auto',
                            borderRadius: 1.5,
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        sx={{
                                            width: 110,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Portada
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Título
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Autor
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{
                                            width: 90,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Likes
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{
                                            width: 120,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Comentarios
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{
                                            width: 120,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Estado
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            width: 150,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Acciones
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {filteredPosts.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            sx={{
                                                py: 5,
                                                textAlign: 'center',
                                                color: 'var(--color-secondary-text)',
                                                fontWeight: 800,
                                                borderBottom: 'none',
                                            }}
                                        >
                                            No se encontraron posts con ese criterio.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPosts.map((post) => (
                                        <TableRow
                                            key={post.id}
                                            hover
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor:
                                                        'color-mix(in srgb, var(--color-primary) 8%, transparent)',
                                                },
                                            }}
                                        >
                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                <Avatar
                                                    variant="rounded"
                                                    src={post.imageUrl || '/images/default-post.jpg'}
                                                    alt={post.title}
                                                    sx={{
                                                        width: 78,
                                                        height: 54,
                                                        borderRadius: 1.5,
                                                        bgcolor: 'var(--color-primary)',
                                                        boxShadow:
                                                            '0 8px 20px rgba(15, 23, 42, 0.12)',
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    color: 'var(--color-text)',
                                                    fontWeight: 950,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                    maxWidth: 280,
                                                    overflowWrap: 'anywhere',
                                                }}
                                            >
                                                {post.title}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    color: 'var(--color-text)',
                                                    fontWeight: 800,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                {post.author?.name || 'Desconocido'}
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                sx={{
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 0.4,
                                                        color: 'var(--color-secondary-text)',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    <FavoriteRoundedIcon sx={{ fontSize: 18 }} />
                                                    {post.likes}
                                                </Box>
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                sx={{
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 0.4,
                                                        color: 'var(--color-secondary-text)',
                                                        fontWeight: 900,
                                                    }}
                                                >
                                                    <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} />
                                                    {post.comments?.length || 0}
                                                </Box>
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                sx={{
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                <Chip
                                                    size="small"
                                                    label={post.isPublic ? 'Publicado' : 'Oculto'}
                                                    color={post.isPublic ? 'success' : 'default'}
                                                    sx={{
                                                        fontWeight: 950,
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell
                                                align="right"
                                                sx={{
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'flex-end',
                                                        gap: 0.75,
                                                    }}
                                                >
                                                    <Tooltip title="Editar post">
                                                        <IconButton
                                                            component={RouterLink}
                                                            to={`/admin/blog/edit/${post.id}`}
                                                            aria-label={`Editar ${post.title}`}
                                                            sx={{
                                                                color: 'var(--color-primary)',
                                                                backgroundColor:
                                                                    'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        'color-mix(in srgb, var(--color-primary) 18%, transparent)',
                                                                },
                                                            }}
                                                        >
                                                            <EditRoundedIcon />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Eliminar post">
                                                        <IconButton
                                                            aria-label={`Eliminar ${post.title}`}
                                                            onClick={() => handleDelete(post.id)}
                                                            sx={{
                                                                color: '#dc2626',
                                                                backgroundColor:
                                                                    'color-mix(in srgb, #dc2626 10%, transparent)',
                                                                '&:hover': {
                                                                    backgroundColor:
                                                                        'color-mix(in srgb, #dc2626 18%, transparent)',
                                                                },
                                                            }}
                                                        >
                                                            <DeleteRoundedIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
};