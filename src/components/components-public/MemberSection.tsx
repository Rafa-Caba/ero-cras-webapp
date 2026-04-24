// src/components/components-public/MemberSection.tsx

import { useEffect } from 'react';

import {
    Avatar,
    Box,
    CircularProgress,
    Paper,
    Typography,
} from '@mui/material';

import { useMemberStore } from '../../store/public/useMemberStore';

const MemberSection = () => {
    const { members, loading, fetchMembers } = useMemberStore();

    useEffect(() => {
        void fetchMembers();
    }, [fetchMembers]);

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 320,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'var(--color-text)',
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2, fontWeight: 800 }}>
                        Cargando integrantes...
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
                minWidth: 0,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    width: '100%',
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
                    Integrantes
                </Typography>

                {members.length > 0 ? (
                    <Box
                        sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, minmax(0, 1fr))',
                                md: 'repeat(3, minmax(0, 1fr))',
                                lg: 'repeat(4, minmax(0, 1fr))',
                            },
                            gap: {
                                xs: 2,
                                md: 2.5,
                            },
                            justifyItems: 'center',
                        }}
                    >
                        {members.map((member) => {
                            const memberWithInstrument = member as typeof member & {
                                instrumentLabel?: string;
                                instrument?: string;
                            };

                            const instrumentText =
                                memberWithInstrument.instrumentLabel ||
                                memberWithInstrument.instrument ||
                                'Sin instrumento asignado';

                            return (
                                <Paper
                                    key={member.id}
                                    elevation={0}
                                    sx={{
                                        width: '100%',
                                        maxWidth: 280,
                                        height: '100%',
                                        p: 2,
                                        borderRadius: 2,
                                        backgroundColor:
                                            'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                                        border: '1px solid var(--color-border)',
                                        color: 'var(--color-text)',
                                        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
                                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 18px 42px rgba(15, 23, 42, 0.14)',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            textAlign: 'center',
                                            gap: 1.25,
                                        }}
                                    >
                                        <Avatar
                                            src={member.imageUrl || '/images/default-user.png'}
                                            alt={member.name}
                                            sx={{
                                                width: {
                                                    xs: 116,
                                                    md: 160,
                                                },
                                                height: {
                                                    xs: 116,
                                                    md: 160,
                                                },
                                                border: '3px solid color-mix(in srgb, var(--color-primary) 72%, white)',
                                                boxShadow: '0 10px 26px rgba(15, 23, 42, 0.16)',
                                            }}
                                        />

                                        <Box>
                                            <Typography
                                                component="h2"
                                                sx={{
                                                    fontSize: '1.15rem',
                                                    fontWeight: 950,
                                                    lineHeight: 1.15,
                                                }}
                                            >
                                                {member.name}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.75,
                                                    fontSize: '0.95rem',
                                                    fontWeight: 800,
                                                    color: 'var(--color-secondary-text)',
                                                }}
                                            >
                                                {instrumentText}
                                            </Typography>

                                            {member.voice && (
                                                <Typography
                                                    sx={{
                                                        mt: 0.35,
                                                        fontSize: '0.9rem',
                                                        fontWeight: 800,
                                                        color: 'var(--color-primary)',
                                                    }}
                                                >
                                                    Voz
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </Paper>
                            );
                        })}
                    </Box>
                ) : (
                    <Typography
                        sx={{
                            py: 5,
                            textAlign: 'center',
                            fontWeight: 800,
                            color: 'var(--color-secondary-text)',
                        }}
                    >
                        No hay miembros por mostrar.
                    </Typography>
                )}
            </Paper>
        </Box>
    );
};

export default MemberSection;