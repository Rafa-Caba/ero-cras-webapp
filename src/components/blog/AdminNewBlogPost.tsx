import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import type { JSONContent } from '@tiptap/react';

import { useBlogStore } from '../../store/admin/useBlogStore';
import type { CreateBlogPayload } from '../../types/blog';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { parseText } from '../../utils/handleTextTipTap';

type InputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export const AdminNewBlogPost = () => {
    const navigate = useNavigate();
    const { addPost, loading } = useBlogStore();

    const defaultFormData: CreateBlogPayload = {
        title: '',
        content: emptyEditorContent,
        isPublic: false,
        file: undefined
    };

    const [formData, setFormData] = useState<CreateBlogPayload>(defaultFormData);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const handleContentChange = (newContent: JSONContent) => {
        setFormData(prev => ({ ...prev, content: newContent }));
    };

    const handleChange = (e: InputEvent) => {
        const { name, type, value, checked, files } = e.target as HTMLInputElement;

        setFormData(prev => {
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
        const newErrors: string[] = [];

        if (!formData.title.trim()) newErrors.push('El título es obligatorio.');

        const hasContent = formData.content?.content && formData.content.content.length > 0;
        if (!hasContent) newErrors.push('El contenido no puede estar vacío.');

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addPost(formData);
            Swal.fire('¡Post creado!', '✅ El post se ha creado exitosamente.', 'success');

            setFormData(defaultFormData);
            setPreviewUrl(null);
            setErrors([]);
            navigate('/admin/blog');
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el post', 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <article className="m-3 col-md-8 mx-auto">
            <div className="form-canto">
                <h3>Nuevo Post</h3>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Título del post"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contenido</Form.Label>
                        <TiptapEditor
                            content={parseText(formData.content)}
                            onChange={handleContentChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Publicado"
                            name="isPublic"
                            checked={formData.isPublic}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Imagen de portada</Form.Label>
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
                                style={{ maxHeight: '200px' }}
                            />
                        </div>
                    )}

                    {errors.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-center">
                        <Button type="submit" className="general_btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                    Guardando...
                                </>
                            ) : (
                                'Crear post'
                            )}
                        </Button>
                        <Button className="ms-2" variant="secondary" onClick={() => navigate('/admin/blog')}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};