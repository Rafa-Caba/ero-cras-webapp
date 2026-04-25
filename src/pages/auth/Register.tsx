// src/pages/auth/Register.tsx

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';

import AppRegistrationRoundedIcon from '@mui/icons-material/AppRegistrationRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import { AdminFooter } from '../../components/components-admin/AdminFooter';
import { useAuth } from '../../context/AuthContext';
import { MuiAppThemeProvider } from '../../theme/mui/MuiAppThemeProvider';

interface RegisterFormData {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    choirCode: string;
}

interface ApiErrorResponse {
    message?: string;
}

export const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        choirCode: '',
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [profileFileName, setProfileFileName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const getRegisterErrorMessage = (error: unknown): string => {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            return error.response?.data?.message || 'Error al conectar con el servidor';
        }

        return 'Error al conectar con el servidor';
    };

    const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        if (errors.length > 0) {
            setErrors([]);
        }

        setFormData((previousValue) => ({
            ...previousValue,
            [name]: value,
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        if (errors.length > 0) {
            setErrors([]);
        }

        setProfileFileName(selectedFile.name);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors: string[] = [];

        if (!formData.name.trim()) {
            newErrors.push('El nombre es requerido.');
        }

        if (!formData.username.trim()) {
            newErrors.push('El usuario es requerido.');
        }

        if (!formData.email.trim()) {
            newErrors.push('El correo es requerido.');
        }

        if (!formData.password) {
            newErrors.push('La contraseña es requerida.');
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.push('Las contraseñas no coinciden.');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await register({
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                instrument: '',
                choirCode: formData.choirCode || undefined,
            });

            Swal.fire(
                '¡Registrado!',
                'Usuario creado con éxito. Por favor inicia sesión.',
                'success',
            );
            navigate('/auth/login');
        } catch (error) {
            const message = getRegisterErrorMessage(error);
            Swal.fire('Error', message, 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <MuiAppThemeProvider>
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowX: 'hidden',
                    background:
                        'linear-gradient(135deg, color-mix(in srgb, var(--color-background) 94%, var(--color-primary) 6%) 0%, var(--color-background) 55%, color-mix(in srgb, var(--color-background) 92%, var(--color-accent) 8%) 100%)',
                    color: 'var(--color-text)',
                }}
            >
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        background:
                            'linear-gradient(90deg, color-mix(in srgb, var(--color-primary) 92%, #000 8%) 0%, var(--color-primary) 55%, var(--color-accent) 100%)',
                        borderBottom: '1px solid color-mix(in srgb, var(--color-border) 60%, transparent)',
                    }}
                >
                    <Toolbar
                        sx={{
                            minHeight: '72px !important',
                            px: {
                                xs: 1.5,
                                sm: 2,
                                md: 3,
                            },
                            gap: 1.25,
                        }}
                    >
                        <Avatar
                            src="/images/erocrasLogo.png"
                            alt="Ero Cras Oficial"
                            sx={{
                                width: 44,
                                height: 44,
                                border: '1px solid rgba(255, 255, 255, 0.28)',
                                bgcolor: 'rgba(255, 255, 255, 0.18)',
                                color: 'var(--color-button-text)',
                                fontWeight: 950,
                            }}
                        >
                            EC
                        </Avatar>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 950,
                                    lineHeight: 1.1,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'var(--color-button-text)',
                                }}
                            >
                                Ero Cras Oficial - Admin
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    display: {
                                        xs: 'none',
                                        sm: 'block',
                                    },
                                    color: 'color-mix(in srgb, var(--color-button-text) 86%, transparent)',
                                    fontWeight: 800,
                                }}
                            >
                                Registro de usuario
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        px: {
                            xs: 1.5,
                            sm: 2,
                            md: 3,
                        },
                        py: {
                            xs: 3,
                            md: 5,
                        },
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            width: '100%',
                            maxWidth: 720,
                            p: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                            },
                            borderRadius: 2,
                            backgroundColor: 'color-mix(in srgb, var(--color-card) 86%, transparent)',
                            border: '1px solid color-mix(in srgb, var(--color-border) 88%, transparent)',
                            color: 'var(--color-text)',
                            boxShadow: '0 18px 60px rgba(15, 23, 42, 0.12)',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                mb: 3,
                            }}
                        >
                            <Avatar
                                src={previewUrl || '/images/erocrasLogo.png'}
                                alt="Ero Cras Oficial"
                                sx={{
                                    width: {
                                        xs: 104,
                                        md: 122,
                                    },
                                    height: {
                                        xs: 104,
                                        md: 122,
                                    },
                                    mb: 2,
                                    border: '3px solid var(--color-primary)',
                                    boxShadow: '0 14px 38px rgba(15, 23, 42, 0.18)',
                                }}
                            />

                            <Typography
                                component="h1"
                                sx={{
                                    fontSize: {
                                        xs: '1.7rem',
                                        md: '2rem',
                                    },
                                    fontWeight: 950,
                                    lineHeight: 1.1,
                                }}
                            >
                                Registrar Usuario
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.75,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 700,
                                }}
                            >
                                Crea tu cuenta para acceder al panel del coro.
                            </Typography>
                        </Box>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
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
                                label="Nombre"
                                placeholder="Nombre Completo"
                                value={formData.name}
                                onChange={handleTextChange}
                                required
                                autoComplete="name"
                            />

                            <TextField
                                type="text"
                                name="username"
                                label="Usuario"
                                placeholder="Usuario"
                                value={formData.username}
                                onChange={handleTextChange}
                                required
                                autoComplete="username"
                            />

                            <TextField
                                type="email"
                                name="email"
                                label="Correo"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleTextChange}
                                required
                                autoComplete="email"
                            />

                            <TextField
                                type="text"
                                name="choirCode"
                                label="Código de Coro (Opcional)"
                                placeholder="Ej. eroc1"
                                value={formData.choirCode}
                                onChange={handleTextChange}
                                helperText="Déjalo vacío para registrarte en el coro principal."
                            />

                            <TextField
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                label="Contraseña"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleTextChange}
                                required
                                autoComplete="new-password"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword
                                                            ? 'Ocultar contraseña'
                                                            : 'Mostrar contraseña'
                                                    }
                                                    onClick={() => setShowPassword((currentValue) => !currentValue)}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffRoundedIcon />
                                                    ) : (
                                                        <VisibilityRoundedIcon />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <TextField
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                label="Repetir Contraseña"
                                placeholder="Repetir Contraseña"
                                value={formData.confirmPassword}
                                onChange={handleTextChange}
                                required
                                autoComplete="new-password"
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showConfirmPassword
                                                            ? 'Ocultar confirmación de contraseña'
                                                            : 'Mostrar confirmación de contraseña'
                                                    }
                                                    onClick={() =>
                                                        setShowConfirmPassword((currentValue) => !currentValue)
                                                    }
                                                    edge="end"
                                                >
                                                    {showConfirmPassword ? (
                                                        <VisibilityOffRoundedIcon />
                                                    ) : (
                                                        <VisibilityRoundedIcon />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />

                            <Box
                                sx={{
                                    gridColumn: '1 / -1',
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    sx={{
                                        py: 1.15,
                                        borderRadius: 1.5,
                                        justifyContent: 'center',
                                        fontWeight: 950,
                                    }}
                                >
                                    {profileFileName || 'Seleccionar foto de perfil (Opcional)'}
                                    <input
                                        hidden
                                        type="file"
                                        name="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>

                                <Typography
                                    sx={{
                                        mt: 0.75,
                                        color: 'var(--color-secondary-text)',
                                        fontSize: '0.82rem',
                                        fontWeight: 700,
                                        textAlign: 'center',
                                    }}
                                >
                                    La imagen se usa como vista previa local.
                                </Typography>
                            </Box>

                            {errors.length > 0 && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        gridColumn: '1 / -1',
                                        borderRadius: 1.5,
                                        fontWeight: 700,
                                    }}
                                >
                                    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                        {errors.map((errorItem) => (
                                            <li key={errorItem}>{errorItem}</li>
                                        ))}
                                    </Box>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                endIcon={<AppRegistrationRoundedIcon />}
                                sx={{
                                    gridColumn: '1 / -1',
                                    justifySelf: {
                                        xs: 'stretch',
                                        sm: 'center',
                                    },
                                    minWidth: {
                                        sm: 220,
                                    },
                                    py: 1.15,
                                    borderRadius: 1.5,
                                    fontWeight: 950,
                                }}
                            >
                                Registrar
                            </Button>
                        </Box>

                        <Typography
                            sx={{
                                mt: 3,
                                textAlign: 'center',
                                color: 'var(--color-secondary-text)',
                                fontWeight: 700,
                            }}
                        >
                            ¿Ya tienes cuenta?{' '}
                            <Box
                                component={RouterLink}
                                to="/auth/login"
                                sx={{
                                    color: 'var(--color-primary)',
                                    fontWeight: 950,
                                    '&:hover': {
                                        color: 'var(--color-accent)',
                                    },
                                }}
                            >
                                Iniciar Sesión
                            </Box>
                        </Typography>
                    </Paper>
                </Box>

                <AdminFooter />
            </Box>
        </MuiAppThemeProvider>
    );
};