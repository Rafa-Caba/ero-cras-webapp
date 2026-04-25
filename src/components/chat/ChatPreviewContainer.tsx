// src/components/chat/ChatPreviewContainer.tsx

import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Typography,
} from '@mui/material';

import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { obtenerIconoArchivo } from '../../utils/functionsFilesNames';

interface Props {
    previewType: 'image' | 'file' | 'audio' | 'video' | null;
    previewUrl: string | null;
    previewName?: string;
    loading: boolean;
    onPreviewClick: (
        type: 'image' | 'file' | 'audio' | 'video',
        url: string,
        name?: string,
    ) => void;
    onImageClick: (url: string) => void;
}

export const ChatPreviewContainer = ({
    previewType,
    previewUrl,
    previewName,
    loading,
    onPreviewClick,
    onImageClick,
}: Props) => {
    if (!previewType || !previewUrl) {
        return null;
    }

    if (previewType === 'image') {
        return (
            <Paper
                elevation={0}
                sx={{
                    flexShrink: 0,
                    p: 1,
                    borderRadius: 1.5,
                    backgroundColor:
                        'color-mix(in srgb, var(--color-card) 84%, var(--color-primary) 16%)',
                    border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    alignSelf: 'flex-start',
                }}
            >
                <Button
                    variant="text"
                    onClick={() => onImageClick(previewUrl)}
                    sx={{
                        p: 0,
                        minWidth: 0,
                        textTransform: 'none',
                        color: 'var(--color-text)',
                    }}
                >
                    <Box
                        component="img"
                        src={previewUrl}
                        alt="Imagen seleccionada"
                        sx={{
                            width: 80,
                            height: 70,
                            borderRadius: 1.25,
                            objectFit: 'cover',
                            display: 'block',
                            border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                        }}
                    />
                </Button>

                <Box>
                    <Typography
                        sx={{
                            fontWeight: 950,
                            fontSize: '0.82rem',
                        }}
                    >
                        Imagen seleccionada
                    </Typography>

                    <Typography
                        sx={{
                            color: 'var(--color-secondary-text)',
                            fontWeight: 750,
                            fontSize: '0.76rem',
                        }}
                    >
                        Toca para ampliar
                    </Typography>
                </Box>
            </Paper>
        );
    }

    const icon = obtenerIconoArchivo(previewName || '');
    const caption = previewType === 'file' ? 'Ver archivo' : 'Reproducir';

    return (
        <Paper
            elevation={0}
            sx={{
                flexShrink: 0,
                p: 1,
                borderRadius: 1.5,
                backgroundColor:
                    'color-mix(in srgb, var(--color-card) 84%, var(--color-primary) 16%)',
                border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    minWidth: 0,
                }}
            >
                <FontAwesomeIcon icon={icon} size="lg" />

                <Box sx={{ minWidth: 0 }}>
                    <Typography
                        sx={{
                            fontWeight: 950,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {previewName}
                    </Typography>

                    <Typography
                        sx={{
                            color: 'var(--color-secondary-text)',
                            fontWeight: 750,
                            fontSize: '0.76rem',
                        }}
                    >
                        Archivo seleccionado
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flexShrink: 0,
                }}
            >
                {loading && <CircularProgress size={18} />}

                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onPreviewClick(previewType, previewUrl, previewName);
                    }}
                    sx={{
                        borderRadius: 999,
                        fontWeight: 950,
                    }}
                >
                    {caption}
                </Button>
            </Box>
        </Paper>
    );
};