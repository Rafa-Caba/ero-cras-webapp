// src/components/components-public/SongModal.tsx

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

import type { Song } from '../../types/song';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import { parseText } from '../../utils/handleTextTipTap';

interface SongModalProps {
    show: boolean;
    onHide: () => void;
    categoryName: string;
    songs: Song[];
}

export const SongModal = ({ show, onHide, categoryName, songs }: SongModalProps) => {
    return (
        <Dialog
            open={show}
            onClose={onHide}
            fullWidth
            maxWidth="md"
            scroll="paper"
            slotProps={{
                paper: {
                    sx: {
                        width: {
                            xs: 'calc(100vw - 24px)',
                            sm: 'calc(100vw - 40px)',
                            md: '100%',
                        },
                        maxWidth: {
                            xs: 'calc(100vw - 24px)',
                            sm: 'calc(100vw - 40px)',
                            md: '900px',
                        },
                        height: {
                            xs: 'calc(100dvh - 24px)',
                            sm: 'calc(100dvh - 40px)',
                            md: 'auto',
                        },
                        maxHeight: {
                            xs: 'calc(100dvh - 24px)',
                            sm: 'calc(100dvh - 40px)',
                            md: 'calc(100dvh - 64px)',
                        },
                        m: {
                            xs: 1.5,
                            sm: 2.5,
                            md: 4,
                        },
                        borderRadius: {
                            xs: 1.5,
                            md: 2,
                        },
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-text)',
                        border: '1px solid var(--color-border)',
                        boxShadow: '0 24px 70px rgba(15, 23, 42, 0.24)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    flexShrink: 0,
                    px: {
                        xs: 2,
                        md: 3,
                    },
                    py: 2,
                    backgroundColor: 'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                    borderBottom: '1px solid var(--color-border)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    <Typography
                        component="span"
                        sx={{
                            fontSize: {
                                xs: '1.15rem',
                                md: '1.35rem',
                            },
                            fontWeight: 950,
                            lineHeight: 1.1,
                        }}
                    >
                        {categoryName}
                    </Typography>

                    <Button
                        variant="text"
                        onClick={onHide}
                        startIcon={<CloseRoundedIcon />}
                        sx={{
                            minWidth: 'auto',
                            color: 'var(--color-primary)',
                            fontWeight: 900,
                            '& .MuiButton-startIcon': {
                                mr: {
                                    xs: 0,
                                    sm: 0.75,
                                },
                            },
                        }}
                    >
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                            Cerrar
                        </Box>
                    </Button>
                </Box>
            </DialogTitle>

            <DialogContent
                dividers
                sx={{
                    flex: 1,
                    minHeight: 0,
                    p: {
                        xs: 1.25,
                        md: 2,
                    },
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            >
                {songs.length > 0 ? (
                    songs.map((song) => (
                        <Accordion
                            key={song.id}
                            disableGutters
                            sx={{
                                mb: 1,
                                borderRadius: '10px !important',
                                overflow: 'hidden',
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-card) 92%, var(--color-primary) 8%)',
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text)',
                                boxShadow: 'none',
                                '&::before': {
                                    display: 'none',
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreRoundedIcon sx={{ color: 'var(--color-primary)' }} />}
                                sx={{
                                    minHeight: 54,
                                    '& .MuiAccordionSummary-content': {
                                        my: 1,
                                    },
                                }}
                            >
                                <Typography sx={{ fontWeight: 900 }}>
                                    {song.title}
                                </Typography>
                            </AccordionSummary>

                            <AccordionDetails
                                sx={{
                                    backgroundColor: 'var(--color-card)',
                                    borderTop: '1px solid var(--color-border)',
                                    px: {
                                        xs: 1.5,
                                        md: 2,
                                    },
                                    py: 2,
                                }}
                            >
                                <Typography
                                    component="p"
                                    sx={{
                                        m: 0,
                                        mb: 1.5,
                                        fontWeight: 950,
                                        fontSize: {
                                            xs: '1.1rem',
                                            md: '1.3rem',
                                        },
                                        textAlign: 'center',
                                    }}
                                >
                                    - {song.title} -
                                </Typography>

                                <Divider sx={{ mb: 2, borderColor: 'var(--color-border)' }} />

                                <Box
                                    sx={{
                                        width: '100%',
                                        minWidth: 0,
                                        overflowX: 'auto',
                                        overflowY: 'hidden',
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                        '&::-webkit-scrollbar': {
                                            display: 'none',
                                        },
                                    }}
                                >
                                    <TiptapViewer content={parseText(song.content)} />
                                </Box>

                                <Typography
                                    component="p"
                                    sx={{
                                        mt: 2,
                                        mb: 0,
                                        fontStyle: 'italic',
                                        fontWeight: 700,
                                        color: 'var(--color-secondary-text)',
                                    }}
                                >
                                    {song.songTypeName} - {song.composer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))
                ) : (
                    <Typography
                        sx={{
                            py: 5,
                            textAlign: 'center',
                            fontWeight: 800,
                            color: 'var(--color-secondary-text)',
                        }}
                    >
                        No hay cantos para mostrar en esta categoría.
                    </Typography>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    flexShrink: 0,
                    px: {
                        xs: 2,
                        md: 3,
                    },
                    py: 1.5,
                    backgroundColor: 'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                    borderTop: '1px solid var(--color-border)',
                }}
            >
                <Button
                    variant="contained"
                    onClick={onHide}
                    sx={{
                        borderRadius: 1.5,
                        backgroundColor: 'var(--color-button)',
                        color: 'var(--color-button-text)',
                        fontWeight: 900,
                        '&:hover': {
                            backgroundColor: 'var(--color-accent)',
                        },
                    }}
                >
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    );
};