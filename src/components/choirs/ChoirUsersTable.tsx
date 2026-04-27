// src/components/choirs/ChoirUsersTable.tsx

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
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import type { ChoirUser } from '../../types/choir';

type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'VIEWER' | 'USER';

interface ChoirUsersTableProps {
    choirId: string;
    users: ChoirUser[];
    loading: boolean;
    searchTerm: string;
    currentPage: number;
    totalPages: number;
    onSearchChange: (value: string) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onDeleteUser: (userId: string) => Promise<void>;
}

const getRoleChipColor = (role: UserRole) => {
    if (role === 'SUPER_ADMIN') {
        return {
            label: 'Super Admin',
            backgroundColor: '#111827',
            color: '#ffffff',
        };
    }

    if (role === 'ADMIN') {
        return {
            label: 'Admin',
            backgroundColor: '#dc2626',
            color: '#ffffff',
        };
    }

    if (role === 'EDITOR') {
        return {
            label: 'Editor',
            backgroundColor: '#f59e0b',
            color: '#111827',
        };
    }

    if (role === 'USER') {
        return {
            label: 'Usuario',
            backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
            color: 'var(--color-text)',
        };
    }

    return {
        label: 'Viewer',
        backgroundColor: 'color-mix(in srgb, var(--color-card) 74%, var(--color-border) 26%)',
        color: 'var(--color-text)',
    };
};

export const ChoirUsersTable = ({
    choirId,
    users,
    loading,
    searchTerm,
    currentPage,
    totalPages,
    onSearchChange,
    onPreviousPage,
    onNextPage,
    onDeleteUser,
}: ChoirUsersTableProps) => {
    const filteredUsers = users.filter((userItem) => {
        const searchValue = searchTerm.toLowerCase();

        return (
            userItem.name.toLowerCase().includes(searchValue) ||
            userItem.username.toLowerCase().includes(searchValue) ||
            userItem.email.toLowerCase().includes(searchValue)
        );
    });

    const handleDelete = async (userId: string, userName: string): Promise<void> => {
        const result = await Swal.fire({
            title: '¿Eliminar usuario?',
            text: `Esta acción eliminará a ${userName} permanentemente.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            heightAuto: false,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await onDeleteUser(userId);

            await Swal.fire({
                title: 'Eliminado',
                text: 'El usuario ha sido eliminado.',
                icon: 'success',
                confirmButtonText: 'OK',
                heightAuto: false,
            });
        } catch {
            await Swal.fire({
                title: 'Error',
                text: 'No se pudo eliminar el usuario.',
                icon: 'error',
                confirmButtonText: 'OK',
                heightAuto: false,
            });
        }
    };

    return (
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleRoundedIcon sx={{ color: 'var(--color-primary)' }} />
                    <Box>
                        <Typography sx={{ fontWeight: 950, fontSize: '1.15rem' }}>
                            Usuarios actuales del coro
                        </Typography>
                        <Typography sx={{ color: 'var(--color-secondary-text)', fontWeight: 750, fontSize: '0.82rem' }}>
                            Consulta y administra los usuarios asignados a este coro.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    component={RouterLink}
                    to={`/admin/choirs/view/${choirId}/users/new`}
                    variant="contained"
                    startIcon={<AddRoundedIcon />}
                    sx={{
                        borderRadius: 1.5,
                        px: 2,
                        py: 0.9,
                        fontWeight: 950,
                    }}
                >
                    Nuevo Usuario
                </Button>
            </Box>

            <TextField
                type="text"
                label="Buscar"
                placeholder="Buscar por nombre, usuario o correo..."
                value={searchTerm}
                onChange={(event) => onSearchChange(event.target.value)}
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
                        minHeight: 260,
                        display: 'grid',
                        placeItems: 'center',
                    }}
                >
                    <Box sx={{ textAlign: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2, fontWeight: 800 }}>
                            Cargando usuarios del coro...
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
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {['Avatar', 'Nombre', 'Usuario', 'Correo', 'Rol', 'Instrumento', 'Acciones'].map((label) => (
                                    <TableCell
                                        key={label}
                                        align={label === 'Acciones' ? 'right' : 'left'}
                                        sx={{
                                            backgroundColor:
                                                'color-mix(in srgb, var(--color-card) 82%, var(--color-primary) 18%)',
                                            color: 'var(--color-text)',
                                            fontWeight: 950,
                                            borderBottom:
                                                '1px solid color-mix(in srgb, var(--color-border) 42%, transparent)',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredUsers.length === 0 ? (
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
                                        No se encontraron usuarios en este coro.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((userItem) => {
                                    const roleChip = getRoleChipColor(userItem.role);

                                    return (
                                        <TableRow
                                            key={userItem.id}
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
                                                    width: 86,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                <Avatar
                                                    src={userItem.imageUrl || undefined}
                                                    alt={userItem.username}
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        bgcolor: 'var(--color-primary)',
                                                        color: 'var(--color-button-text)',
                                                        fontWeight: 900,
                                                        boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                                                    }}
                                                >
                                                    {userItem.name?.slice(0, 1).toUpperCase() || 'U'}
                                                </Avatar>
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    color: 'var(--color-text)',
                                                    fontWeight: 950,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                    minWidth: 190,
                                                }}
                                            >
                                                {userItem.name}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    color: 'var(--color-secondary-text)',
                                                    fontWeight: 850,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                    minWidth: 150,
                                                }}
                                            >
                                                @{userItem.username}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    color: 'var(--color-secondary-text)',
                                                    fontWeight: 850,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                    minWidth: 220,
                                                }}
                                            >
                                                {userItem.email}
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                }}
                                            >
                                                <Chip
                                                    size="small"
                                                    label={roleChip.label}
                                                    sx={{
                                                        fontWeight: 950,
                                                        backgroundColor: roleChip.backgroundColor,
                                                        color: roleChip.color,
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    color: 'var(--color-text)',
                                                    fontWeight: 800,
                                                    borderBottom:
                                                        '1px solid color-mix(in srgb, var(--color-border) 32%, transparent)',
                                                    minWidth: 150,
                                                }}
                                            >
                                                {userItem.instrumentLabel || userItem.instrument || '-'}
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
                                                    <Tooltip title="Editar usuario">
                                                        <IconButton
                                                            component={RouterLink}
                                                            to={`/admin/choirs/view/${choirId}/users/edit/${userItem.id}`}
                                                            aria-label={`Editar ${userItem.name}`}
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

                                                    <Tooltip title="Eliminar usuario">
                                                        <IconButton
                                                            aria-label={`Eliminar ${userItem.name}`}
                                                            onClick={() => {
                                                                void handleDelete(userItem.id, userItem.name);
                                                            }}
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
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {totalPages > 1 && (
                <Box
                    sx={{
                        flexShrink: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Button
                        variant="outlined"
                        disabled={currentPage === 1}
                        onClick={onPreviousPage}
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 950,
                        }}
                    >
                        Anterior
                    </Button>

                    <Typography sx={{ fontWeight: 900 }}>
                        Página {currentPage} de {totalPages}
                    </Typography>

                    <Button
                        variant="outlined"
                        disabled={currentPage === totalPages}
                        onClick={onNextPage}
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 950,
                        }}
                    >
                        Siguiente
                    </Button>
                </Box>
            )}
        </Paper>
    );
};