import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import type { JSONContent } from '@tiptap/react';

import { useBlogStore } from '../../store/admin/useBlogStore';
import type { CreateBlogPayload } from '../../types/blog';
import { parseText } from '../../utils/handleTextTipTap';
import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { emptyEditorContent } from '../../utils/editorDefaults';

type InputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export const AdminEditBlogPost = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { getPost, editPost, loading } = useBlogStore();

    const defaultFormData: CreateBlogPayload = {
        title: '',
        content: emptyEditorContent,
        isPublic: true,
        file: undefined
    };

    const [formData, setFormData] = useState<CreateBlogPayload | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (!formData) setFormData(defaultFormData);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                const post = await getPost(id);
                if (post) {
                    setFormData({
                        title: post.title,
                        content: parseText(post.content) as any,
                        isPublic: post.isPublic,
                        file: undefined
                    });
                    setPreviewUrl(post.imageUrl || null);
                }
            }
            setInitialLoading(false);
        };
        loadData();
    }, [id]);

    const handleContentChange = (newContent: JSONContent) => {
        setFormData(prev => {
            if (!prev) return null;
            return { ...prev, content: newContent };
        });
    };

    const handleChange = (e: InputEvent) => {
        const { name, value, type, checked, files } = e.target as HTMLInputElement;

        setFormData(prev => {
            if (!prev) return null;

            if (name === 'file' && files && files[0]) {
                const file = files[0];
                setPreviewUrl(URL.createObjectURL(file));
                return { ...prev, file: file };
            }

            if (type === 'checkbox') {
                return { ...prev, [name]: checked };
            }

            return { ...prev, [name]: value };
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors: string[] = [];

        if (!formData?.title.trim()) validationErrors.push('El título es requerido.');
        if (!formData?.content) validationErrors.push('El contenido es requerido.');

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (!formData) return;

        try {
            if (id) await editPost(id, formData);

            Swal.fire('Actualizado', '✅ El post fue actualizado', 'success');
            navigate('/admin/blog');
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if (initialLoading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
    if (!formData && id) return null;

    return (
        <article className="m-3 col-md-8 mx-auto">
            <div className="form-canto">
                <h3>Editar BlogPost</h3>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData?.title ?? ''}
                            onChange={handleChange}
                            placeholder="Título del post"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Texto del Blog</Form.Label>
                        <TiptapEditor
                            content={formData?.content ?? emptyEditorContent}
                            onChange={handleContentChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPublicado">
                        <Form.Check
                            type="checkbox"
                            name="isPublic"
                            label="¿Publicado?"
                            checked={formData?.isPublic ?? false}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Imagen de imagen</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {previewUrl && (
                        <div className="text-center mb-4">
                            <p className="fw-bold mb-2">Vista previa:</p>
                            <img
                                src={previewUrl}
                                alt="Vista previa"
                                className="img-fluid rounded"
                                style={{ maxHeight: '150px' }}
                            />
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errors.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-center">
                        {/* 🛠️ FIX: Added Loading Feedback */}
                        <Button type="submit" className="general_btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar cambios'
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            className="ms-2"
                            onClick={() => navigate('/admin/blog')}
                        >
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};