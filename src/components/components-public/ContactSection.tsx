// src/components-public/ContactSection.tsx

import type { Dispatch, FormEvent, SetStateAction } from 'react';

import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
} from '@mui/material';

import SendRoundedIcon from '@mui/icons-material/SendRounded';

interface Props {
    email: string;
    setEmail: Dispatch<SetStateAction<string>>;
    emailMessage: string;
    setEmailMessage: Dispatch<SetStateAction<string>>;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const ContactSection = ({
    email,
    setEmail,
    emailMessage,
    setEmailMessage,
    handleSubmit,
}: Props) => {
    const isSubmitDisabled = !email || !emailMessage;

    return (
        <Box
            component="section"
            sx={{
                width: '100%',
                minWidth: 0,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
                    maxWidth: 760,
                    p: {
                        xs: 1.5,
                        sm: 2,
                        md: 3,
                    },
                    borderRadius: {
                        xs: 1.5,
                        md: 2,
                    },
                    backgroundColor: 'color-mix(in srgb, var(--color-card) 82%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--color-border) 84%, transparent)',
                    color: 'var(--color-text)',
                    boxShadow: '0 10px 28px rgba(15, 23, 42, 0.06)',
                    overflow: 'hidden',
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        mb: {
                            xs: 2,
                            md: 3,
                        },
                        textAlign: 'center',
                        fontSize: {
                            xs: '1.7rem',
                            md: '2rem',
                        },
                        fontWeight: 950,
                        lineHeight: 1.1,
                    }}
                >
                    Contacto
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <TextField
                        type="email"
                        id="email_address"
                        label="Correo Electrónico"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        helperText="Te enviaremos un mensaje de confirmación"
                        required
                        fullWidth
                        slotProps={{
                            input: {
                                sx: {
                                    color: 'var(--color-text)',
                                },
                            },
                            inputLabel: {
                                sx: {
                                    color: 'var(--color-secondary-text)',
                                },
                            },
                            formHelperText: {
                                sx: {
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 700,
                                },
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-card) 92%, var(--color-primary) 8%)',
                                '& fieldset': {
                                    borderColor: 'var(--color-border)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--color-primary)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--color-primary)',
                                },
                            },
                        }}
                    />

                    <TextField
                        id="email_message"
                        label="Mensaje"
                        value={emailMessage}
                        onChange={(event) => setEmailMessage(event.target.value)}
                        required
                        fullWidth
                        multiline
                        minRows={5}
                        slotProps={{
                            input: {
                                sx: {
                                    color: 'var(--color-text)',
                                },
                            },
                            inputLabel: {
                                sx: {
                                    color: 'var(--color-secondary-text)',
                                },
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-card) 92%, var(--color-primary) 8%)',
                                '& fieldset': {
                                    borderColor: 'var(--color-border)',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'var(--color-primary)',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'var(--color-primary)',
                                },
                            },
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitDisabled}
                        endIcon={<SendRoundedIcon />}
                        sx={{
                            alignSelf: {
                                xs: 'stretch',
                                sm: 'center',
                            },
                            minWidth: {
                                sm: 220,
                            },
                            borderRadius: 1.5,
                            py: 1.1,
                            backgroundColor: 'var(--color-button)',
                            color: 'var(--color-button-text)',
                            fontWeight: 950,
                            '&:hover': {
                                backgroundColor: 'var(--color-accent)',
                            },
                            '&.Mui-disabled': {
                                color: 'color-mix(in srgb, var(--color-text) 42%, transparent)',
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-card) 70%, var(--color-border) 30%)',
                            },
                        }}
                    >
                        Enviar mensaje
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};