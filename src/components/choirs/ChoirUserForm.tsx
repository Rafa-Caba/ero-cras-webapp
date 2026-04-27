// src/components/choirs/ChoirUserForm.tsx

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import {
    Avatar,
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
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { useChoirsStore } from '../../store/admin/useChoirsStore';
import { useInstrumentsStore } from '../../store/admin/useInstrumentsStore';
import { InstrumentPickerModal } from '../components-admin/instruments/InstrumentPickerModal';
import type { Instrument } from '../../types/instrument';
import type { CreateChoirUserPayload } from '../../types/choir';

type ChoirAssignableUserRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

interface ChoirUserFormState {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: ChoirAssignableUserRole;
    instrumentId: string;
    instrumentLabel: string;
    bio: string;
    voice: boolean;
}

const roleOptions: Array<{ value: ChoirAssignableUserRole; label: string; description: string }> = [
    {
        value: 'VIEWER',
        label: 'Viewer',
        description: 'Solo ver',
    },
    {
        value: 'EDITOR',
        label: 'Editor',
        description: 'Gestionar contenido',
    },
    {
        value: 'ADMIN',
        label: 'Admin',
        description: 'Control total del coro',
    },
];

export const ChoirUserForm = () => {
    const { choirId } = useParams<{ choirId: string }>();
    const navigate = useNavigate();

    const {
        selectedChoir,
        fetchChoir,
        createChoirUserAction,
    } = useChoirsStore();

    const {
        instruments,
        fetchInstruments,
    } = useInstrumentsStore();

    const [formData, setFormData] = useState<ChoirUserFormState>({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'VIEWER',
        instrumentId: '',
        instrumentLabel: '',
        bio: '',
        voice: false,
    });

    const [file, setFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);

    const selectedChoirName = selectedChoir?.name || 'este coro';

    const selectedInstrument = useMemo(() => {
        if (!formData.instrumentId) {
            return null;
        }

        return instruments.find((instrument) => instrument.id === formData.instrumentId) || null;
    }, [formData.instrumentId, instruments]);

    useEffect(() => {
        if (choirId) {
            void fetchChoir(choirId);
        }
    }, [choirId, fetchChoir]);

    useEffect(() => {
        if (instruments.length === 0) {
            void fetchInstruments();
        }
    }, [fetchInstruments, instruments.length]);

    useEffect(() => {
        return () => {
            if (previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleChange = (field: keyof ChoirUserFormState) => (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const value = event.target.value;

        setFormData((currentValue) => ({
            ...currentValue,
            [field]: value,
        }));
    };

    const handleRoleChange = (event: SelectChangeEvent<ChoirAssignableUserRole>) => {
        const selectedRole = event.target.value;

        if (
            selectedRole !== 'ADMIN' &&
            selectedRole !== 'EDITOR' &&
            selectedRole !== 'VIEWER'
        ) {
            return;
        }

        setFormData((currentValue) => ({
            ...currentValue,
            role: selectedRole,
        }));
    };

    const handleVoiceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((currentValue) => ({
            ...currentValue,
            voice: event.target.checked,
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        if (previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleInstrumentSelect = (instrument: Instrument | null) => {
        if (!instrument) {
            setFormData((currentValue) => ({
                ...currentValue,
                instrumentId: '',
                instrumentLabel: '',
            }));
            return;
        }

        setFormData((currentValue) => ({
            ...currentValue,
            instrumentId: instrument.id,
            instrumentLabel: instrument.name,
        }));
    };

    const validateForm = (): boolean => {
        if (!choirId) {
            Swal.fire('Error', 'No se encontró el coro seleccionado.', 'error');
            return false;
        }

        if (!formData.name.trim()) {
            Swal.fire('Campo requerido', 'El nombre es obligatorio.', 'warning');
            return false;
        }

        if (!formData.username.trim()) {
            Swal.fire('Campo requerido', 'El usuario es obligatorio.', 'warning');
            return false;
        }

        if (!formData.email.trim()) {
            Swal.fire('Campo requerido', 'El correo es obligatorio.', 'warning');
            return false;
        }

        if (!formData.password.trim()) {
            Swal.fire('Campo requerido', 'La contraseña es obligatoria.', 'warning');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            Swal.fire('Contraseñas diferentes', 'La contraseña y la confirmación no coinciden.', 'warning');
            return false;
        }

        return true;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm() || !choirId) {
            return;
        }

        setShowInstrumentPicker(false);
        setLoading(true);

        try {
            const payload: CreateChoirUserPayload = {
                name: formData.name.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
                role: formData.role,
                instrumentId: formData.instrumentId,
                instrumentLabel: formData.instrumentLabel,
                bio: formData.bio.trim(),
                voice: formData.voice,
            };

            await createChoirUserAction(choirId, payload, file);

            setLoading(false);

            await Swal.fire({
                title: 'Guardado',
                text: 'El usuario fue creado correctamente en el coro.',
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: true,
                allowEscapeKey: true,
                heightAuto: false,
            });

            navigate(`/admin/choirs/view/${choirId}`, { replace: true });
        } catch (error) {
            console.error(error);
            setLoading(false);

            await Swal.fire({
                title: 'Error',
                text: 'No se pudo crear el usuario.',
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: true,
                allowEscapeKey: true,
                heightAuto: false,
            });
        }
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
                        justifyContent: 'space-between',
                        alignItems: {
                            xs: 'stretch',
                            md: 'center',
                        },
                        gap: 1.5,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
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
                                flexShrink: 0,
                            }}
                        >
                            <ManageAccountsRoundedIcon />
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
                                Nuevo usuario para {selectedChoirName}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                }}
                            >
                                Crea una cuenta asociada directamente a este coro.
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate(choirId ? `/admin/choirs/view/${choirId}` : '/admin/choirs')}
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 950,
                        }}
                    >
                        Volver
                    </Button>
                </Box>
            </Paper>

            <Paper
                component="form"
                elevation={0}
                onSubmit={handleSubmit}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    p: {
                        xs: 1.5,
                        md: 2,
                    },
                    borderRadius: 2,
                    background:
                        'linear-gradient(145deg, color-mix(in srgb, var(--color-card) 86%, var(--color-primary) 14%) 0%, color-mix(in srgb, var(--color-card) 76%, transparent) 100%)',
                    border: '1px solid color-mix(in srgb, var(--color-border) 38%, transparent)',
                    color: 'var(--color-text)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
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
                            md: '220px minmax(0, 1fr)',
                        },
                        gap: 2,
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor:
                                'color-mix(in srgb, var(--color-card) 78%, var(--color-primary) 22%)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 38%, transparent)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.5,
                            height: 'fit-content',
                        }}
                    >
                        <Avatar
                            src={previewUrl || undefined}
                            alt={formData.name || 'Usuario'}
                            sx={{
                                width: 126,
                                height: 126,
                                bgcolor: 'var(--color-primary)',
                                color: 'var(--color-button-text)',
                                fontWeight: 950,
                                fontSize: '2.4rem',
                            }}
                        >
                            {formData.name.charAt(0).toUpperCase() || 'U'}
                        </Avatar>

                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadRoundedIcon />}
                            sx={{
                                borderRadius: 1.5,
                                fontWeight: 950,
                            }}
                        >
                            Subir Foto
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Paper>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(2, minmax(0, 1fr))',
                            },
                            gap: 1.5,
                            alignContent: 'start',
                        }}
                    >
                        <TextField
                            label="Nombre"
                            value={formData.name}
                            onChange={handleChange('name')}
                            required
                        />

                        <TextField
                            label="Usuario"
                            value={formData.username}
                            onChange={handleChange('username')}
                            required
                        />

                        <TextField
                            label="Correo"
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            required
                        />

                        <FormControl fullWidth>
                            <InputLabel id="choir-user-role-label">Rol</InputLabel>
                            <Select
                                labelId="choir-user-role-label"
                                label="Rol"
                                value={formData.role}
                                onChange={handleRoleChange}
                            >
                                {roleOptions.map((roleOption) => (
                                    <MenuItem key={roleOption.value} value={roleOption.value}>
                                        {roleOption.label} - {roleOption.description}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Contraseña"
                            type="password"
                            value={formData.password}
                            onChange={handleChange('password')}
                            required
                        />

                        <TextField
                            label="Confirmar contraseña"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange('confirmPassword')}
                            required
                        />

                        <TextField
                            label="Instrumento"
                            value={formData.instrumentLabel}
                            placeholder="Selecciona un instrumento"
                            onClick={() => setShowInstrumentPicker(true)}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.voice}
                                    onChange={handleVoiceChange}
                                />
                            }
                            label="Voz / cantante"
                            sx={{
                                color: 'var(--color-text)',
                                fontWeight: 800,
                            }}
                        />

                        <TextField
                            label="Biografía"
                            value={formData.bio}
                            onChange={handleChange('bio')}
                            multiline
                            minRows={4}
                            sx={{
                                gridColumn: {
                                    xs: 'auto',
                                    md: '1 / -1',
                                },
                            }}
                        />
                    </Box>
                </Box>

                {selectedInstrument && (
                    <Typography
                        sx={{
                            color: 'var(--color-secondary-text)',
                            fontWeight: 800,
                        }}
                    >
                        Instrumento seleccionado: {selectedInstrument.name}
                    </Typography>
                )}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        flexDirection: {
                            xs: 'column',
                            md: 'row'
                        },
                        gap: 1,
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} /> : <SaveRoundedIcon />}
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 950,
                            order: {
                                xs: 1,
                                md: 2
                            },
                        }}
                    >
                        Guardar Usuario
                    </Button>

                    <Button
                        type="button"
                        variant="outlined"
                        onClick={() => navigate(choirId ? `/admin/choirs/view/${choirId}` : '/admin/choirs')}
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 950,
                            order: {
                                xs: 2,
                                md: 1
                            },
                        }}
                    >
                        Cancelar
                    </Button>
                </Box>
            </Paper>

            <InstrumentPickerModal
                show={showInstrumentPicker}
                onClose={() => setShowInstrumentPicker(false)}
                instruments={instruments}
                selectedInstrumentId={formData.instrumentId}
                onSelectInstrument={handleInstrumentSelect}
            />
        </Box>
    );
};