// src/pages/admin/choir/ChoirForm.tsx

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    FormControlLabel,
    Paper,
    Switch,
    TextField,
    Typography,
} from '@mui/material';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { useChoirsStore } from '../../../store/admin/useChoirsStore';
import type { CreateChoirPayload } from '../../../types/choir';

interface ChoirFormState {
    name: string;
    code: string;
    description: string;
    isActive: boolean;
}

export const ChoirForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { saveChoirAction, getChoirByIdFromState, fetchChoir } = useChoirsStore();

    const isEdit = Boolean(id);

    const [formData, setFormData] = useState<ChoirFormState>({
        name: '',
        code: '',
        description: '',
        isActive: true,
    });

    const [file, setFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFileName, setSelectedFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!isEdit || !id) {
                return;
            }

            setInitialLoading(true);

            try {
                let choirToEdit = getChoirByIdFromState(id);

                if (!choirToEdit) {
                    const fetched = await fetchChoir(id);
                    choirToEdit = fetched ?? undefined;
                }

                if (choirToEdit) {
                    setFormData({
                        name: choirToEdit.name,
                        code: choirToEdit.code,
                        description: choirToEdit.description || '',
                        isActive: choirToEdit.isActive,
                    });
                    setPreviewUrl(choirToEdit.logoUrl || '');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo cargar el coro.', 'error');
            } finally {
                setInitialLoading(false);
            }
        };

        void loadData();
    }, [id, isEdit, getChoirByIdFromState, fetchChoir]);

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData((previousValue) => ({
            ...previousValue,
            [name]: value,
        }));
    };

    const handleActiveChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((previousValue) => ({
            ...previousValue,
            isActive: event.target.checked,
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setFile(selectedFile);
        setSelectedFileName(selectedFile.name);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!formData.name.trim() || !formData.code.trim()) {
            Swal.fire('Error', 'Nombre y código son obligatorios', 'error');
            return;
        }

        setLoading(true);

        try {
            const payload: CreateChoirPayload = {
                name: formData.name.trim(),
                code: formData.code.trim(),
                description: formData.description.trim() || undefined,
                isActive: formData.isActive,
            };

            await saveChoirAction(payload, file, id);

            Swal.fire(
                'Éxito',
                `Coro ${isEdit ? 'actualizado' : 'creado'} correctamente`,
                'success',
            );
            navigate('/admin/choirs');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el coro', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
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
                            <GroupsRoundedIcon />
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
                                {isEdit ? 'Editar Coro' : 'Nuevo Coro'}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                }}
                            >
                                {isEdit
                                    ? 'Actualiza la información del coro seleccionado.'
                                    : 'Registra un nuevo coro dentro de la plataforma.'}
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate('/admin/choirs')}
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
                        xs: 1.5,
                        md: 2,
                    },
                    borderRadius: 2,
                    background:
                        'linear-gradient(145deg, color-mix(in srgb, var(--color-card) 86%, var(--color-primary) 14%) 0%, color-mix(in srgb, var(--color-card) 76%, transparent) 100%)',
                    border: '1px solid color-mix(in srgb, var(--color-border) 28%, transparent)',
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
                        width: '100%',
                        height: '100%',
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            lg: 'minmax(0, 1fr) 320px',
                        },
                        gap: {
                            xs: 2,
                            md: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    md: 'repeat(2, minmax(0, 1fr))',
                                },
                                gap: 2,
                            }}
                        >
                            <TextField
                                type="text"
                                name="name"
                                label="Nombre *"
                                value={formData.name}
                                onChange={handleTextChange}
                                required
                                disabled={loading}
                            />

                            <TextField
                                type="text"
                                name="code"
                                label="Código *"
                                placeholder="ej. eroc1"
                                value={formData.code}
                                onChange={handleTextChange}
                                required
                                disabled={loading}
                            />
                        </Box>

                        <TextField
                            name="description"
                            label="Descripción"
                            value={formData.description}
                            onChange={handleTextChange}
                            placeholder="Breve descripción del coro"
                            multiline
                            minRows={4}
                            disabled={loading}
                        />

                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                                border:
                                    '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                                boxShadow: 'inset 0 1px 16px rgba(15, 23, 42, 0.035)',
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isActive}
                                        onChange={handleActiveChange}
                                        disabled={loading}
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography sx={{ fontWeight: 950 }}>
                                            ¿Coro activo?
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: 'var(--color-secondary-text)',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            Si está inactivo, puede ocultarse o limitarse según la lógica del sistema.
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
                    </Box>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor:
                                'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                            boxShadow:
                                'inset 0 1px 0 color-mix(in srgb, var(--color-button-text) 12%, transparent), 0 10px 28px rgba(15, 23, 42, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                            alignSelf: 'start',
                        }}
                    >
                        <Typography
                            component="h2"
                            sx={{
                                fontSize: '1.05rem',
                                fontWeight: 950,
                                textAlign: 'center',
                            }}
                        >
                            Logo del Coro
                        </Typography>

                        <Avatar
                            src={previewUrl || undefined}
                            alt="Preview"
                            sx={{
                                width: 154,
                                height: 154,
                                bgcolor: 'var(--color-primary)',
                                color: 'var(--color-button-text)',
                                fontSize: '3rem',
                                fontWeight: 950,
                                border:
                                    '3px solid color-mix(in srgb, var(--color-primary) 64%, white)',
                                boxShadow: '0 14px 34px rgba(15, 23, 42, 0.14)',
                            }}
                        >
                            {formData.name.trim().charAt(0).toUpperCase() || 'C'}
                        </Avatar>

                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUploadRoundedIcon />}
                            disabled={loading}
                            sx={{
                                width: '100%',
                                borderRadius: 1.5,
                                py: 0.9,
                                fontWeight: 950,
                            }}
                        >
                            {selectedFileName || 'Seleccionar imagen'}
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>

                        <Typography
                            sx={{
                                textAlign: 'center',
                                color: 'var(--color-secondary-text)',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                            }}
                        >
                            Usa una imagen cuadrada para mejor resultado.
                        </Typography>
                    </Paper>

                    <Box
                        sx={{
                            gridColumn: '1 / -1',
                            display: 'flex',
                            flexDirection: {
                                xs: 'column-reverse',
                                sm: 'row',
                            },
                            alignItems: {
                                xs: 'stretch',
                                sm: 'center',
                            },
                            justifyContent: 'flex-end',
                            gap: 1,
                            pt: 1,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<ArrowBackRoundedIcon />}
                            onClick={() => navigate('/admin/choirs')}
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
                            variant="contained"
                            type="submit"
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
                            {loading ? 'Guardando...' : 'Guardar Coro'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};