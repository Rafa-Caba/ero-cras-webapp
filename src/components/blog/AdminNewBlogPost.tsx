// src/components/blog/AdminNewBlogPost.tsx

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { JSONContent } from '@tiptap/react';
import Swal from 'sweetalert2';

import {
    Alert,
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
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { useBlogStore } from '../../store/admin/useBlogStore';
import type { CreateBlogPayload } from '../../types/blog';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { parseText } from '../../utils/handleTextTipTap';

const buildBlogContentPayload = (editorContent: JSONContent): CreateBlogPayload['content'] => {
    const parsedContent = parseText(editorContent);

    return {
        ...parsedContent,
        type: parsedContent.type ?? 'doc',
        content: parsedContent.content ?? [],
    };
};

const hasContentBlocks = (content: CreateBlogPayload['content']) => {
    return Array.isArray(content.content) && content.content.length > 0;
};

export const AdminNewBlogPost = () => {
    const navigate = useNavigate();
    const { addPost, loading } = useBlogStore();

    const defaultFormData: CreateBlogPayload = {
        title: '',
        content: emptyEditorContent,
        isPublic: false,
        file: undefined,
    };

    const [formData, setFormData] = useState<CreateBlogPayload>(defaultFormData);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [errors, setErrors] = useState<string[]>([]);

    const handleContentChange = (newContent: JSONContent) => {
        setFormData((previousValue) => ({
            ...previousValue,
            content: buildBlogContentPayload(newContent),
        }));
    };

    const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData((previousValue) => ({
            ...previousValue,
            [name]: value,
        }));
    };

    const handlePublicChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((previousValue) => ({
            ...previousValue,
            isPublic: event.target.checked,
        }));
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }

            setPreviewUrl(null);
            setSelectedFileName('');
            setFormData((previousValue) => ({
                ...previousValue,
                file: undefined,
            }));
            return;
        }

        if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(URL.createObjectURL(file));
        setSelectedFileName(file.name);

        setFormData((previousValue) => ({
            ...previousValue,
            file,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const newErrors: string[] = [];

        if (!formData.title.trim()) {
            newErrors.push('El título es obligatorio.');
        }

        if (!hasContentBlocks(formData.content)) {
            newErrors.push('El contenido no puede estar vacío.');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addPost(formData);
            Swal.fire('¡Post creado!', '✅ El post se ha creado exitosamente.', 'success');

            setFormData(defaultFormData);
            setPreviewUrl(null);
            setSelectedFileName('');
            setErrors([]);
            navigate('/admin/blog');
        } catch {
            Swal.fire('Error', 'No se pudo crear el post', 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

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
                            <ArticleRoundedIcon />
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
                                Nuevo Post
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                }}
                            >
                                Crea una publicación para el blog del coro.
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackRoundedIcon />}
                        onClick={() => navigate('/admin/blog')}
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
                    encType="multipart/form-data"
                    sx={{
                        maxWidth: 920,
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
                    <TextField
                        type="text"
                        name="title"
                        label="Título"
                        placeholder="Título del post"
                        value={formData.title}
                        onChange={handleTextChange}
                        disabled={loading}
                        required
                    />

                    <Box>
                        <Typography sx={{ mb: 1, fontWeight: 950 }}>
                            Contenido
                        </Typography>

                        <TiptapEditor
                            content={parseText(formData.content)}
                            onChange={handleContentChange}
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
                                    name="isPublic"
                                    checked={formData.isPublic}
                                    onChange={handlePublicChange}
                                    disabled={loading}
                                />
                            }
                            label={
                                <Box>
                                    <Typography sx={{ fontWeight: 950 }}>
                                        Publicado
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--color-secondary-text)',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        Si está activo, el post aparecerá en la vista pública del blog.
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
                            {selectedFileName || 'Seleccionar imagen de portada'}
                            <input hidden type="file" name="file" accept="image/*" onChange={handleFileChange} />
                        </Button>

                        <Typography
                            sx={{
                                mt: 0.75,
                                color: 'var(--color-secondary-text)',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                textAlign: 'center',
                            }}
                        >
                            La imagen es opcional.
                        </Typography>
                    </Paper>

                    {previewUrl && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                backgroundColor:
                                    'color-mix(in srgb, var(--color-card) 88%, var(--color-primary) 12%)',
                                border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                                textAlign: 'center',
                            }}
                        >
                            <Typography sx={{ mb: 1, fontWeight: 950 }}>
                                Vista previa
                            </Typography>

                            <Box
                                component="img"
                                src={previewUrl}
                                alt="Vista previa"
                                sx={{
                                    width: '100%',
                                    maxHeight: 260,
                                    objectFit: 'contain',
                                    borderRadius: 1.5,
                                    display: 'block',
                                }}
                            />
                        </Paper>
                    )}

                    {errors.length > 0 && (
                        <Alert severity="error" sx={{ borderRadius: 1.5, fontWeight: 700 }}>
                            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                {errors.map((errorItem) => (
                                    <li key={errorItem}>{errorItem}</li>
                                ))}
                            </Box>
                        </Alert>
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
                            onClick={() => navigate('/admin/blog')}
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
                                    <CircularProgress size={18} sx={{ color: 'var(--color-button-text)' }} />
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
                            {loading ? 'Guardando...' : 'Crear post'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};