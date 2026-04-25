// src/components/users/MyProfile.tsx

import { useEffect, useMemo, useState } from 'react';

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Typography,
} from '@mui/material';

import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';

import { capitalizeWord } from '../../utils/capitalize';
import { useAuth } from '../../context/AuthContext';
import { useLogStore } from '../../store/admin/useLogStore';

const logsPerPage = 4;

const formatRoleLabel = (role: string | undefined) => {
    if (!role) {
        return 'No disponible';
    }

    if (role === 'SUPER_ADMIN') {
        return 'Super Admin';
    }

    return capitalizeWord(role);
};

export const MyProfile = () => {
    const { user } = useAuth();
    const { userLogs, fetchUserLogs, loading } = useLogStore();

    const [activityPage, setActivityPage] = useState(1);

    useEffect(() => {
        if (user?.id) {
            void fetchUserLogs(user.id);
        }
    }, [user?.id, fetchUserLogs]);

    useEffect(() => {
        setActivityPage(1);
    }, [userLogs.length]);

    const totalActivityPages = Math.max(1, Math.ceil(userLogs.length / logsPerPage));

    const paginatedLogs = useMemo(() => {
        const startIndex = (activityPage - 1) * logsPerPage;
        const endIndex = startIndex + logsPerPage;

        return userLogs.slice(startIndex, endIndex);
    }, [activityPage, userLogs]);

    const handlePreviousPage = () => {
        setActivityPage((currentPage) => Math.max(1, currentPage - 1));
    };

    const handleNextPage = () => {
        setActivityPage((currentPage) => Math.min(totalActivityPages, currentPage + 1));
    };

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
                        <ArticleRoundedIcon />
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
                            Mi Perfil
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.4,
                                color: 'var(--color-secondary-text)',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                            }}
                        >
                            Información general y actividad reciente de tu cuenta.
                        </Typography>
                    </Box>
                </Box>
            </Paper>

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
                }}
            >
                <Box
                    sx={{
                        height: '100%',
                        minHeight: 0,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '190px minmax(0, 1fr)',
                            },
                            gap: 2,
                            alignItems: 'stretch',
                            mb: 2,
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-card) 90%, var(--color-primary) 10%)',
                                border: '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Avatar
                                src={user?.imageUrl || '/default-avatar.png'}
                                alt="Foto de perfil"
                                sx={{
                                    width: 160,
                                    height: 160,
                                    bgcolor: 'var(--color-primary)',
                                    color: 'var(--color-button-text)',
                                    fontSize: '2.6rem',
                                    fontWeight: 950,
                                    border: '3px solid color-mix(in srgb, var(--color-border) 60%, transparent)',
                                }}
                            >
                                {user?.name?.slice(0, 1).toUpperCase() || 'U'}
                            </Avatar>

                            <Typography
                                component="h2"
                                sx={{
                                    mt: 1.25,
                                    m: 0,
                                    fontSize: {
                                        xs: '1.25rem',
                                        md: '1.35rem',
                                    },
                                    fontWeight: 950,
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                {user?.name}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.35,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 800,
                                    overflowWrap: 'anywhere',
                                }}
                            >
                                @{user?.username}
                            </Typography>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: {
                                    xs: 1.25,
                                    md: 1.5,
                                },
                                borderRadius: 2,
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-card) 90%, var(--color-primary) 10%)',
                                border: '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                component="h3"
                                sx={{
                                    mb: 1.25,
                                    fontSize: '1.08rem',
                                    fontWeight: 950,
                                }}
                            >
                                Información general
                            </Typography>

                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: '1fr',
                                        md: 'repeat(2, minmax(0, 1fr))',
                                    },
                                    gap: 1,
                                }}
                            >
                                {[
                                    {
                                        label: 'Email',
                                        value: user?.email || 'No disponible',
                                    },
                                    {
                                        label: 'Rol',
                                        value: formatRoleLabel(user?.role),
                                    },
                                    {
                                        label: 'Instrumento',
                                        value: user?.instrumentLabel || user?.instrument || 'No especificado',
                                    },
                                    {
                                        label: 'Voz',
                                        value: user?.voice ? 'Sí' : 'No',
                                    },
                                    {
                                        label: 'Último acceso',
                                        value: user?.updatedAt
                                            ? new Date(user.updatedAt).toLocaleString('es-MX', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })
                                            : 'No registrado',
                                    },
                                ].map((item) => (
                                    <Box
                                        key={item.label}
                                        sx={{
                                            p: 1,
                                            borderRadius: 1.5,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            border:
                                                '1px solid color-mix(in srgb, var(--color-border) 24%, transparent)',
                                            minWidth: 0,
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                color: 'var(--color-secondary-text)',
                                                fontWeight: 900,
                                                fontSize: '0.76rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                            }}
                                        >
                                            {item.label}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.2,
                                                color: 'var(--color-text)',
                                                fontWeight: 850,
                                                overflowWrap: 'anywhere',
                                            }}
                                        >
                                            {item.value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: 'color-mix(in srgb, var(--color-border) 36%, transparent)' }} />

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
                            gap: 1,
                            mb: 1,
                        }}
                    >
                        <Typography
                            component="h3"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontSize: '1.15rem',
                                fontWeight: 950,
                            }}
                        >
                            <HistoryRoundedIcon />
                            Actividad reciente
                        </Typography>

                        {userLogs.length > logsPerPage && (
                            <Typography
                                sx={{
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 800,
                                    fontSize: '0.86rem',
                                    textAlign: {
                                        xs: 'left',
                                        sm: 'right',
                                    },
                                }}
                            >
                                Página {activityPage} de {totalActivityPages}
                            </Typography>
                        )}
                    </Box>

                    {loading ? (
                        <Box
                            sx={{
                                py: 4,
                                display: 'grid',
                                placeItems: 'center',
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : userLogs.length === 0 ? (
                        <Typography
                            sx={{
                                color: 'var(--color-secondary-text)',
                                fontWeight: 800,
                                textAlign: 'center',
                                py: 2,
                            }}
                        >
                            No se encontraron actividades recientes.
                        </Typography>
                    ) : (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                    pb: 1,
                                }}
                            >
                                {paginatedLogs.map((log) => (
                                    <Paper
                                        key={log.id}
                                        elevation={0}
                                        sx={{
                                            p: 1.25,
                                            borderRadius: 1.5,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 92%, var(--color-primary) 8%)',
                                            border:
                                                '1px solid color-mix(in srgb, var(--color-border) 28%, transparent)',
                                            color: 'var(--color-text)',
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 850, textAlign: 'center' }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    color: 'var(--color-primary)',
                                                    fontWeight: 950,
                                                }}
                                            >
                                                {capitalizeWord(log.action)}
                                            </Box>{' '}
                                            en <em>{capitalizeWord(log.collectionName)}</em>
                                            {log.referenceId && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        color: 'var(--color-secondary-text)',
                                                    }}
                                                >
                                                    {' '}
                                                    (ID: {log.referenceId})
                                                </Box>
                                            )}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                mt: 0.5,
                                                color: 'var(--color-secondary-text)',
                                                fontWeight: 700,
                                                fontSize: '0.82rem',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {new Date(log.createdAt).toLocaleString('es-MX', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            })}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>

                            {userLogs.length > logsPerPage && (
                                <Box
                                    sx={{
                                        mt: 1,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        disabled={activityPage === 1}
                                        onClick={handlePreviousPage}
                                        sx={{
                                            borderRadius: 1.5,
                                            fontWeight: 950,
                                        }}
                                    >
                                        Anterior
                                    </Button>

                                    <Typography sx={{ fontWeight: 900 }}>
                                        {activityPage} / {totalActivityPages}
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        disabled={activityPage === totalActivityPages}
                                        onClick={handleNextPage}
                                        sx={{
                                            borderRadius: 1.5,
                                            fontWeight: 950,
                                        }}
                                    >
                                        Siguiente
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};