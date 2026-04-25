// src/components/songTypes/AdminSongTypeList.tsx

import { useEffect, useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    Box,
    Breadcrumbs,
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
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import MusicNoteRoundedIcon from '@mui/icons-material/MusicNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import type { SongType } from '../../types';
import { useSongTypeStore } from '../../store/admin/useSongTypeStore';
import { capitalizeWord } from '../../utils';

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

export const AdminSongTypeList = () => {
    const [search, setSearch] = useState('');
    const [currentParent, setCurrentParent] = useState<SongType | null>(null);

    const {
        types,
        loading,
        fetchTypes,
        removeType,
    } = useSongTypeStore();

    useEffect(() => {
        void fetchTypes();
    }, [fetchTypes]);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el tipo de canto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await removeType(id);
            Swal.fire('Eliminado', 'El tipo ha sido eliminado.', 'success');
        } catch {
            Swal.fire('Error', 'No se pudo eliminar el tipo', 'error');
        }
    };

    const filteredTypes = types.filter((typeItem) => {
        if (search.trim() !== '') {
            return typeItem.name.toLowerCase().includes(search.toLowerCase());
        }

        if (currentParent) {
            return typeItem.parentId === currentParent.id;
        }

        return !typeItem.parentId;
    });

    const handleEnterFolder = (typeItem: SongType) => {
        setCurrentParent(typeItem);
        setSearch('');
    };

    const handleGoBack = () => {
        setCurrentParent(null);
        setSearch('');
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
                title="Tipos de Canto"
                subtitle="Organiza los cantos por carpetas y categorías."
                icon={<CategoryRoundedIcon />}
                action={
                    <Button
                        component={RouterLink}
                        to="/admin/song-types/new"
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        sx={{
                            borderRadius: 1.5,
                            px: 2,
                            py: 0.9,
                            fontWeight: 950,
                        }}
                    >
                        Nuevo Tipo
                    </Button>
                }
            />

            <Paper
                elevation={0}
                sx={{
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
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'minmax(0, 1fr) minmax(280px, 420px)',
                        },
                        gap: 1.5,
                        alignItems: 'center',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1,
                            borderRadius: 1.5,
                            backgroundColor:
                                'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                            border:
                                '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                            boxShadow: 'inset 0 1px 16px rgba(15, 23, 42, 0.035)',
                            minHeight: 56,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        {currentParent ? (
                            <>
                                <Tooltip title="Volver al directorio principal">
                                    <IconButton
                                        aria-label="Volver al directorio principal"
                                        onClick={handleGoBack}
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
                                        <ArrowBackRoundedIcon />
                                    </IconButton>
                                </Tooltip>

                                <Breadcrumbs
                                    aria-label="Ruta de carpeta"
                                    sx={{
                                        minWidth: 0,
                                        color: 'var(--color-secondary-text)',
                                        fontWeight: 800,
                                    }}
                                >
                                    <Button
                                        type="button"
                                        onClick={handleGoBack}
                                        sx={{
                                            minWidth: 'auto',
                                            px: 0,
                                            color: 'var(--color-primary)',
                                            fontWeight: 950,
                                        }}
                                    >
                                        Principal
                                    </Button>

                                    <Typography
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 0.5,
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        <FolderRoundedIcon sx={{ color: '#facc15', fontSize: 20 }} />
                                        {capitalizeWord(currentParent.name)}
                                    </Typography>
                                </Breadcrumbs>
                            </>
                        ) : (
                            <Typography
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.75,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 950,
                                }}
                            >
                                <FolderRoundedIcon sx={{ color: '#facc15' }} />
                                Directorio Principal
                            </Typography>
                        )}
                    </Paper>

                    <TextField
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar globalmente..."
                        label="Buscar"
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
                </Box>

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
                                Cargando tipos de canto...
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
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Nombre
                                    </TableCell>

                                    <TableCell
                                        align="center"
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
                                        Orden
                                    </TableCell>

                                    <TableCell
                                        align="center"
                                        sx={{
                                            width: 140,
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                        }}
                                    >
                                        Tipo
                                    </TableCell>

                                    <TableCell
                                        align="right"
                                        sx={{
                                            width: 180,
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
                                {filteredTypes.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            sx={{
                                                py: 5,
                                                textAlign: 'center',
                                                color: 'var(--color-secondary-text)',
                                                fontWeight: 800,
                                                borderBottom: 'none',
                                            }}
                                        >
                                            La carpeta está vacía o no hay resultados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTypes.map((typeItem) => (
                                        <TableRow
                                            key={typeItem.id}
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
                                                    color: 'var(--color-text)',
                                                    fontWeight: 900,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                {typeItem.isParent ? (
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleEnterFolder(typeItem)}
                                                        startIcon={<FolderRoundedIcon sx={{ color: '#facc15' }} />}
                                                        sx={{
                                                            justifyContent: 'flex-start',
                                                            color: 'var(--color-primary)',
                                                            fontWeight: 950,
                                                            textAlign: 'left',
                                                            px: 0.5,
                                                            '&:hover': {
                                                                backgroundColor:
                                                                    'color-mix(in srgb, var(--color-primary) 10%, transparent)',
                                                            },
                                                        }}
                                                    >
                                                        {capitalizeWord(typeItem.name)}
                                                    </Button>
                                                ) : (
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                        }}
                                                    >
                                                        <MusicNoteRoundedIcon
                                                            sx={{
                                                                color: 'var(--color-secondary-text)',
                                                                fontSize: 20,
                                                            }}
                                                        />
                                                        {capitalizeWord(typeItem.name)}
                                                    </Box>
                                                )}
                                            </TableCell>

                                            <TableCell
                                                align="center"
                                                sx={{
                                                    color: 'var(--color-text)',
                                                    fontWeight: 800,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                {typeItem.order}
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
                                                    icon={
                                                        typeItem.isParent ? (
                                                            <FolderRoundedIcon />
                                                        ) : (
                                                            <MusicNoteRoundedIcon />
                                                        )
                                                    }
                                                    label={typeItem.isParent ? 'Carpeta' : 'Categoría'}
                                                    sx={{
                                                        color: typeItem.isParent
                                                            ? '#1f2937'
                                                            : 'var(--color-text)',
                                                        backgroundColor: typeItem.isParent
                                                            ? '#facc15'
                                                            : 'color-mix(in srgb, var(--color-card) 76%, var(--color-border) 24%)',
                                                        fontWeight: 950,
                                                        '& .MuiChip-icon': {
                                                            color: typeItem.isParent
                                                                ? '#1f2937'
                                                                : 'var(--color-secondary-text)',
                                                        },
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
                                                    <Tooltip title="Editar tipo">
                                                        <IconButton
                                                            component={RouterLink}
                                                            to={`/admin/song-types/edit/${typeItem.id}`}
                                                            aria-label={`Editar ${typeItem.name}`}
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

                                                    <Tooltip title="Eliminar tipo">
                                                        <IconButton
                                                            aria-label={`Eliminar ${typeItem.name}`}
                                                            onClick={() => handleDelete(typeItem.id)}
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