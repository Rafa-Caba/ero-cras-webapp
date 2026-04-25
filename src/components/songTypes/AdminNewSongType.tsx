// src/components/songTypes/AdminNewSongType.tsx

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { useSongTypeStore } from '../../store/admin/useSongTypeStore';
import { capitalizeWord } from '../../utils';

interface FormState {
    name: string;
    order: string;
    isParent: boolean;
    parentId: string;
}

export const AdminNewSongType = () => {
    const navigate = useNavigate();
    const { addType, types, loading, fetchTypes } = useSongTypeStore();

    const [formData, setFormData] = useState<FormState>({
        name: '',
        order: '99',
        isParent: false,
        parentId: '',
    });

    useEffect(() => {
        void fetchTypes();
    }, [fetchTypes]);

    const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData((previousValue) => ({
            ...previousValue,
            [name]: value,
        }));
    };

    const handleParentChange = (event: SelectChangeEvent<string>) => {
        setFormData((previousValue) => ({
            ...previousValue,
            parentId: event.target.value,
        }));
    };

    const handleIsParentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((previousValue) => ({
            ...previousValue,
            isParent: event.target.checked,
            parentId: event.target.checked ? '' : previousValue.parentId,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { name, order, isParent, parentId } = formData;
        const trimmedName = name.trim();
        const parsedOrder = order.trim() === '' ? 0 : Number(order);

        if (!trimmedName) {
            Swal.fire('Campo requerido', 'El nombre del tipo de canto es obligatorio.', 'warning');
            return;
        }

        if (Number.isNaN(parsedOrder)) {
            Swal.fire('Orden inválido', 'El orden debe ser un número válido.', 'warning');
            return;
        }

        const exists = types.some(
            (typeItem) =>
                typeItem.name.toLowerCase() === trimmedName.toLowerCase() &&
                (typeItem.parentId || '') === (parentId || ''),
        );

        if (exists) {
            Swal.fire('Duplicado', 'Ya existe un tipo de canto con ese nombre en esta carpeta.', 'warning');
            return;
        }

        try {
            await addType(trimmedName, parsedOrder, parentId || null, isParent);
            Swal.fire('Creado', 'Tipo de canto creado con éxito.', 'success');
            navigate('/admin/song-types');
        } catch {
            Swal.fire('Error', 'Hubo un problema al crear el tipo.', 'error');
        }
    };

    const parentOptions = types.filter((typeItem) => typeItem.isParent);

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
                            <CategoryRoundedIcon />
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
                                Nuevo Tipo de Canto
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                }}
                            >
                                Crea carpetas o categorías para organizar los cantos.
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate('/admin/song-types')}
                        disabled={loading}
                        sx={{
                            borderRadius: 1.5,
                            px: 2,
                            py: 0.9,
                            fontWeight: 950,
                        }}
                    >
                        Volver
                    </Button>
                </Box>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    p: {
                        xs: 1,
                        sm: 1.25,
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
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        maxWidth: 720,
                        mx: 'auto',
                        height: '100%',
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: {
                            xs: 1.5,
                            md: 2,
                        },
                        p: '0 !important',
                        m: '0 auto !important',
                        backgroundColor: 'transparent !important',
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'minmax(0, 1fr) 180px',
                            },
                            gap: {
                                xs: 1.5,
                                md: 2,
                            },
                        }}
                    >
                        <TextField
                            type="text"
                            name="name"
                            label="Nombre del tipo"
                            value={formData.name}
                            onChange={handleTextChange}
                            placeholder="Ej. Entrada, Comunión..."
                            disabled={loading}
                            required
                        />

                        <TextField
                            type="number"
                            name="order"
                            label="Orden"
                            value={formData.order}
                            onChange={handleTextChange}
                            placeholder="Ej. 1, 2, 3..."
                            disabled={loading}
                            slotProps={{
                                htmlInput: {
                                    inputMode: 'numeric',
                                },
                            }}
                        />
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            backgroundColor:
                                'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                            boxShadow: 'inset 0 1px 16px rgba(15, 23, 42, 0.035)',
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isParent}
                                    onChange={handleIsParentChange}
                                    disabled={loading}
                                />
                            }
                            label={
                                <Box>
                                    <Typography sx={{ fontWeight: 950 }}>
                                        ¿Es una categoría padre?
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--color-secondary-text)',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        Ejemplo: Ordinario, Misa Especial o una carpeta contenedora.
                                    </Typography>
                                </Box>
                            }
                            sx={{
                                m: 0,
                                alignItems: 'center',
                                gap: 1,
                            }}
                        />
                    </Paper>

                    {!formData.isParent && (
                        <FormControl fullWidth>
                            <InputLabel id="parent-type-label">Categoría Padre (Opcional)</InputLabel>
                            <Select
                                labelId="parent-type-label"
                                value={formData.parentId}
                                label="Categoría Padre (Opcional)"
                                onChange={handleParentChange}
                                disabled={loading}
                            >
                                <MenuItem value="">
                                    <em>-- Ninguna --</em>
                                </MenuItem>

                                {parentOptions.map((parentOption) => (
                                    <MenuItem key={parentOption.id} value={parentOption.id}>
                                        {capitalizeWord(parentOption.name)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

                    <Box
                        sx={{
                            mt: 'auto',
                            display: 'flex',
                            flexDirection: {
                                xs: 'column-reverse',
                                sm: 'row',
                            },
                            justifyContent: 'center',
                            gap: 1,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackRoundedIcon />}
                            onClick={() => navigate('/admin/song-types')}
                            disabled={loading}
                            sx={{
                                borderRadius: 1.5,
                                px: 2.5,
                                py: 0.9,
                                fontWeight: 950,
                            }}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            endIcon={
                                loading ? (
                                    <CircularProgress
                                        size={18}
                                        sx={{ color: 'var(--color-button-text)' }}
                                    />
                                ) : (
                                    <SaveRoundedIcon />
                                )
                            }
                            sx={{
                                borderRadius: 1.5,
                                px: 2.5,
                                py: 0.9,
                                fontWeight: 950,
                            }}
                        >
                            {loading ? 'Creando...' : 'Crear Tipo'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};