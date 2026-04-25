// src/components/chat/ChatImageModal.tsx

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

interface Props {
    imageUrl: string | null;
    onClose: () => void;
}

export const ChatImageModal = ({ imageUrl, onClose }: Props) => {
    return (
        <Dialog
            open={Boolean(imageUrl)}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            scroll="paper"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 2,
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-text)',
                        border: '1px solid color-mix(in srgb, var(--color-border) 46%, transparent)',
                        boxShadow: '0 22px 70px rgba(15, 23, 42, 0.22)',
                        overflow: 'hidden',
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    fontWeight: 950,
                    borderBottom: '1px solid color-mix(in srgb, var(--color-border) 36%, transparent)',
                }}
            >
                <Box
                    component="span"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <ImageRoundedIcon sx={{ color: 'var(--color-primary)' }} />
                    Imagen del mensaje
                </Box>

                <IconButton
                    aria-label="Cerrar imagen"
                    onClick={onClose}
                    sx={{ color: 'var(--color-text)' }}
                >
                    <CloseRoundedIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 2,
                    backgroundColor: 'var(--color-card)',
                    display: 'grid',
                    placeItems: 'center',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            >
                {imageUrl && (
                    <Box
                        component="img"
                        src={imageUrl}
                        alt="Imagen ampliada"
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '80vh',
                            borderRadius: 2,
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    p: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                    borderTop: '1px solid color-mix(in srgb, var(--color-border) 36%, transparent)',
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        borderRadius: 1.5,
                        fontWeight: 950,
                    }}
                >
                    Cerrar
                </Button>

                {imageUrl && (
                    <Button
                        component="a"
                        href={imageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        startIcon={<DownloadRoundedIcon />}
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 950,
                        }}
                    >
                        Descargar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};