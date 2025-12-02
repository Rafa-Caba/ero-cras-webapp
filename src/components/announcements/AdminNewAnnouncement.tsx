import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import type { JSONContent } from '@tiptap/react';

import { useAnnouncementStore } from '../../store/admin/useAnnouncementStore';
import type { CreateAnnouncementPayload } from '../../types/annoucement';

import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { parseText } from '../../utils/handleTextTipTap';
import { emptyEditorContent } from '../../utils/editorDefaults';

export const AdminNewAnnouncement = () => {
    const navigate = useNavigate();
    const { addAnnouncement, loading } = useAnnouncementStore();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const defaultFormData: CreateAnnouncementPayload = {
        title: '',
        content: emptyEditorContent,
        isPublic: true,
        file: undefined
    };

    const [formData, setFormData] = useState<CreateAnnouncementPayload>(defaultFormData);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked, files } = e.target;

        setFormData(prev => {
            if (name === 'file' && files && files[0]) {
                const file = files[0];
                setPreviewUrl(URL.createObjectURL(file));
                return { ...prev, file: file };
            } else if (type === 'checkbox') {
                return { ...prev, [name]: checked };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };

    const handleContentChange = (newContent: JSONContent) => {
        setFormData(prev => ({ ...prev, content: newContent as any }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData.title.trim()) newErrors.push('El título es obligatorio.');
        if (!formData.content) newErrors.push('La descripción es obligatoria.');

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addAnnouncement(formData);
            Swal.fire('¡Aviso creado!', '', 'success');

            setFormData(defaultFormData);
            setPreviewUrl(null);
            setErrors([]);
            navigate('/admin/announcements');
        } catch (error) {
            Swal.fire('Error', 'No se pudo crear el aviso', 'error');
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
                <h3>Nuevo Aviso</h3>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
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

                    <Form.Group className="mb-3">
                        <Form.Label>Imagen</Form.Label>
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
                                {errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-center">
                        <Button type="submit" className="general_btn" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Crear aviso'}
                        </Button>
                        <Button className="ms-2" variant="secondary" onClick={() => navigate('/admin/announcements')}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};