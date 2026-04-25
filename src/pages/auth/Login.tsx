// src/pages/auth/Login.tsx

import { useState, type FormEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import {
    Alert,
    AppBar,
    Avatar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Toolbar,
    Typography,
} from '@mui/material';

import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import { AdminFooter } from '../../components/components-admin/AdminFooter';
import { useAuth } from '../../context/AuthContext';
import { MuiAppThemeProvider } from '../../theme/mui/MuiAppThemeProvider';

interface ApiErrorResponse {
    message?: string;
}

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const getLoginErrorMessage = (error: unknown): string => {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            return error.response?.data?.message || 'Credenciales incorrectas';
        }

        return 'Credenciales incorrectas';
    };

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            await login({ username, password });
            navigate('/admin');
        } catch (error) {
            const message = getLoginErrorMessage(error);
            Swal.fire('Error', message, 'error');
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };

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
                                Acceso administrativo
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        width: '100%',
                        display: 'grid',
                        placeItems: 'center',
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
                            maxWidth: 520,
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
                                src="/images/erocrasLogo.png"
                                alt="Ero Cras Oficial"
                                sx={{
                                    width: {
                                        xs: 118,
                                        md: 140,
                                    },
                                    height: {
                                        xs: 118,
                                        md: 140,
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
                                        xs: '1.75rem',
                                        md: '2rem',
                                    },
                                    fontWeight: 950,
                                    lineHeight: 1.1,
                                }}
                            >
                                Iniciar Sesión
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.75,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 700,
                                }}
                            >
                                Ingresa tus datos para acceder al panel.
                            </Typography>
                        </Box>

                        <Box
                            component="form"
                            onSubmit={handleLogin}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2,
                            }}
                        >
                            <TextField
                                type="text"
                                name="username"
                                label="Usuario o Correo"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                                disabled={loading}
                                autoComplete="username"
                            />

                            <TextField
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                label="Contraseña"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                required
                                disabled={loading}
                                autoComplete="current-password"
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

                            {errorMessage && (
                                <Alert
                                    severity="error"
                                    sx={{
                                        borderRadius: 1.5,
                                        fontWeight: 700,
                                    }}
                                >
                                    {errorMessage}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                endIcon={
                                    loading ? (
                                        <CircularProgress size={18} sx={{ color: 'var(--color-button-text)' }} />
                                    ) : (
                                        <LoginRoundedIcon />
                                    )
                                }
                                sx={{
                                    py: 1.15,
                                    borderRadius: 1.5,
                                    fontWeight: 950,
                                }}
                            >
                                {loading ? 'Cargando...' : 'Login'}
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
                            ¿No tienes cuenta?{' '}
                            <Box
                                component={RouterLink}
                                to="/auth/register"
                                sx={{
                                    color: 'var(--color-primary)',
                                    fontWeight: 950,
                                    '&:hover': {
                                        color: 'var(--color-accent)',
                                    },
                                }}
                            >
                                Regístrate
                            </Box>
                        </Typography>
                    </Paper>
                </Box>

                <AdminFooter />
            </Box>
        </MuiAppThemeProvider>
    );
};