// src/components/choirs/AdminChoirDetail.tsx

import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from '@mui/material';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

import { useChoirsStore } from '../../store/admin/useChoirsStore';
import { ChoirUsersTable } from './ChoirUsersTable';

const formatDate = (value?: string): string => {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '-';
    }

    return new Intl.DateTimeFormat('es-MX', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(date);
};

export const AdminChoirDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');

    const {
        selectedChoir,
        choirUsers,
        choirUsersCurrentPage,
        choirUsersTotalPages,
        choirUsersLoading,
        fetchChoir,
        fetchChoirUsers,
        setChoirUsersCurrentPage,
        deleteChoirUserById,
    } = useChoirsStore();

    useEffect(() => {
        if (!id) {
            return;
        }

        void fetchChoir(id);
    }, [fetchChoir, id]);

    useEffect(() => {
        if (!id) {
            return;
        }

        void fetchChoirUsers(id, choirUsersCurrentPage);
    }, [choirUsersCurrentPage, fetchChoirUsers, id]);

    const handleDeleteUser = async (userId: string): Promise<void> => {
        await deleteChoirUserById(userId);
    };

    if (!id) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 900, color: 'var(--color-text)' }}>
                    No se encontró el identificador del coro.
                </Typography>
            </Box>
        );
    }

    if (!selectedChoir) {
        return (
            <Box
                sx={{
                    minHeight: 320,
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2, fontWeight: 800 }}>
                        Cargando coro...
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
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                pr: {
                    xs: 0,
                    md: 0.5,
                },
                pb: 2,
            }}
        >
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
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: {
                            xs: 'column',
                            md: 'row',
                        },
                        alignItems: {
                            xs: 'stretch',
                            md: 'center',
                        },
                        justifyContent: 'space-between',
                        gap: 1.5,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
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
                            <GroupsRoundedIcon />
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
                                    fontWeight: 850,
                                    lineHeight: 1.1,
                                }}
                            >
                                Visualizando coro: {selectedChoir.name}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                }}
                            >
                                Consulta los datos del coro y administra sus usuarios.
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: {
                                xs: 'column',
                                sm: 'row',
                            },
                            gap: 1,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackRoundedIcon />}
                            onClick={() => navigate('/admin/choirs')}
                            sx={{
                                borderRadius: 1.5,
                                fontWeight: 950,
                            }}
                        >
                            Volver
                        </Button>

                        <Button
                            component={RouterLink}
                            to={`/admin/choirs/edit/${selectedChoir.id}`}
                            variant="contained"
                            startIcon={<EditRoundedIcon />}
                            sx={{
                                borderRadius: 1.5,
                                fontWeight: 950,
                            }}
                        >
                            Editar Coro
                        </Button>
                    </Box>
                </Box>
            </Paper>

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
                        'linear-gradient(145deg, color-mix(in srgb, var(--color-card) 86%, var(--color-primary) 14%) 0%, color-mix(in srgb, var(--color-card) 76%, transparent) 100%)',
                    border: '1px solid color-mix(in srgb, var(--color-border) 38%, transparent)',
                    color: 'var(--color-text)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'auto minmax(0, 1fr)',
                        },
                        gap: 2,
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        src={selectedChoir.logoUrl || undefined}
                        alt={selectedChoir.name}
                        sx={{
                            width: 110,
                            height: 110,
                            mx: 'auto',
                            bgcolor: 'var(--color-primary)',
                            color: 'var(--color-button-text)',
                            fontWeight: 950,
                            fontSize: '2rem',
                            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.14)',
                        }}
                    >
                        {selectedChoir.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: {
                                    xs: 'center',
                                    md: 'start'
                                },
                                gap: 1,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 950,
                                    fontSize: {
                                        xs: '1.35rem',
                                        md: '1.65rem',
                                    },
                                }}
                            >
                                {selectedChoir.name}
                            </Typography>

                            <Chip
                                size="small"
                                label={selectedChoir.isActive ? 'Activo' : 'Inactivo'}
                                sx={{
                                    color: selectedChoir.isActive ? '#ffffff' : 'var(--color-text)',
                                    backgroundColor: selectedChoir.isActive
                                        ? '#16a34a'
                                        : 'color-mix(in srgb, var(--color-card) 74%, var(--color-border) 26%)',
                                    fontWeight: 950,
                                }}
                            />
                        </Box>

                        <Divider sx={{ my: 1.5, borderColor: 'var(--color-border)' }} />

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: 'repeat(2, minmax(0, 1fr))',
                                    sm: 'repeat(2, minmax(0, 1fr))',
                                    md: 'repeat(4, minmax(0, 1fr))',
                                },
                                gap: 1.25,
                            }}
                        >
                            <Box>
                                <Typography sx={{ color: 'var(--color-secondary-text)', fontWeight: 800, fontSize: '0.78rem' }}>
                                    Código
                                </Typography>

                                <Typography sx={{ color: '#9B0606', fontWeight: 950 }}>
                                    {selectedChoir.code}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ color: 'var(--color-secondary-text)', fontWeight: 800, fontSize: '0.78rem' }}>
                                    Descripción
                                </Typography>

                                <Typography sx={{ fontWeight: 950 }}>
                                    {selectedChoir.description || 'Sin descripción registrada.'}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ color: 'var(--color-secondary-text)', fontWeight: 800, fontSize: '0.78rem' }}>
                                    Fecha de creación
                                </Typography>

                                <Typography sx={{ fontWeight: 950 }}>
                                    {formatDate(selectedChoir.createdAt)}
                                </Typography>
                            </Box>

                            <Box>
                                <Typography sx={{ color: 'var(--color-secondary-text)', fontWeight: 800, fontSize: '0.78rem' }}>
                                    Última actualización
                                </Typography>

                                <Typography sx={{ fontWeight: 950 }}>
                                    {formatDate(selectedChoir.updatedAt)}
                                </Typography>
                            </Box>

                            {/* <Box>
                                <Typography sx={{ color: 'var(--color-secondary-text)', fontWeight: 800, fontSize: '0.78rem' }}>
                                    ID
                                </Typography>

                                <Typography
                                    component="code"
                                    sx={{
                                        display: 'block',
                                        fontWeight: 950,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {selectedChoir.id}
                                </Typography>
                            </Box> */}
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Box
                sx={{
                    flexShrink: 0,
                    minHeight: {
                        xs: 420,
                        md: 460,
                    },
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <ChoirUsersTable
                    choirId={id}
                    users={choirUsers}
                    loading={choirUsersLoading}
                    searchTerm={searchTerm}
                    currentPage={choirUsersCurrentPage}
                    totalPages={choirUsersTotalPages}
                    onSearchChange={setSearchTerm}
                    onPreviousPage={() => setChoirUsersCurrentPage(choirUsersCurrentPage - 1)}
                    onNextPage={() => setChoirUsersCurrentPage(choirUsersCurrentPage + 1)}
                    onDeleteUser={handleDeleteUser}
                />
            </Box>
        </Box>
    );
};