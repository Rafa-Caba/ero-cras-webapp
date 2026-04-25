// src/components/blog/AdminEditBlogPost.tsx

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

export const AdminEditBlogPost = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { getPost, editPost, loading } = useBlogStore();

    const [formData, setFormData] = useState<CreateBlogPayload | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                setInitialLoading(false);
                return;
            }

            try {
                const post = await getPost(id);

                if (post) {
                    setFormData({
                        title: post.title,
                        content: buildBlogContentPayload(parseText(post.content)),
                        isPublic: post.isPublic,
                        file: undefined,
                    });
                    setPreviewUrl(post.imageUrl || null);
                }
            } catch {
                Swal.fire('Error', 'No se pudo cargar el post', 'error');
            } finally {
                setInitialLoading(false);
            }
        };

        void loadData();
    }, [id, getPost]);

    const handleContentChange = (newContent: JSONContent) => {
        setFormData((previousValue) => {
            if (!previousValue) {
                return null;
            }

            return {
                ...previousValue,
                content: buildBlogContentPayload(newContent),
            };
        });
    };

    const handleTextChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData((previousValue) => {
            if (!previousValue) {
                return null;
            }

            return {
                ...previousValue,
                [name]: value,
            };
        });
    };

    const handlePublicChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData((previousValue) => {
            if (!previousValue) {
                return null;
            }

            return {
                ...previousValue,
                isPublic: event.target.checked,
            };
        });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (previewUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(URL.createObjectURL(file));
        setSelectedFileName(file.name);

        setFormData((previousValue) => {
            if (!previousValue) {
                return null;
            }

            return {
                ...previousValue,
                file,
            };
        });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors: string[] = [];

        if (!formData?.title.trim()) {
            validationErrors.push('El título es requerido.');
        }

        if (!formData?.content) {
            validationErrors.push('El contenido es requerido.');
        }

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!formData || !id) {
            return;
        }

        try {
            await editPost(id, formData);

            Swal.fire('Actualizado', '✅ El post fue actualizado', 'success');
            navigate('/admin/blog');
        } catch {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

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
                        Cargando post...
                    </Typography>
                </Box>
            </Box>
        );
    }

    if (!formData && id) {
        return null;
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
                                Editar BlogPost
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.4,
                                    color: 'var(--color-secondary-text)',
                                    fontWeight: 800,
                                    fontSize: '0.9rem',
                                }}
                            >
                                Actualiza título, contenido, imagen y estado de publicación.
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
                        value={formData?.title ?? ''}
                        onChange={handleTextChange}
                        placeholder="Título del post"
                        disabled={loading}
                        required
                    />

                    <Box>
                        <Typography sx={{ mb: 1, fontWeight: 950 }}>
                            Texto del Blog
                        </Typography>

                        <TiptapEditor
                            content={formData?.content ?? emptyEditorContent}
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
                                    checked={formData?.isPublic ?? false}
                                    onChange={handlePublicChange}
                                    disabled={loading}
                                />
                            }
                            label={
                                <Box>
                                    <Typography sx={{ fontWeight: 950 }}>
                                        ¿Publicado?
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: 'var(--color-secondary-text)',
                                            fontWeight: 700,
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        Si está activo, el post estará visible en la vista del blog.
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
                            {selectedFileName || 'Seleccionar nueva imagen opcional'}
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
                            Si no seleccionas una nueva imagen, se conservará la actual.
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
                                    maxHeight: 220,
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
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};