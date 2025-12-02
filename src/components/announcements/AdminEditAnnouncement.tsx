import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import type { JSONContent } from '@tiptap/react';

import { useAnnouncementStore } from '../../store/admin/useAnnouncementStore';
import type { CreateAnnouncementPayload } from '../../types/annoucement';

import { emptyEditorContent } from '../../utils/editorDefaults';
import { parseText } from '../../utils/handleTextTipTap';
import { TiptapEditor } from '../tiptap-components/TiptapEditor';

type InputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export const AdminEditAnnouncement = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { getAnnouncement, editAnnouncement, loading } = useAnnouncementStore();

    const defaultFormData: CreateAnnouncementPayload = {
        title: '',
        content: emptyEditorContent,
        isPublic: true,
        file: undefined
    };

    const [formData, setFormData] = useState<CreateAnnouncementPayload>(defaultFormData);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);

    const handleContentChange = (newContent: JSONContent) => {
        setFormData(prev => ({ ...prev, content: newContent as any }));
    };

    const handleChange = (e: InputEvent) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, files, checked } = target;

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

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                const announcement = await getAnnouncement(id);
                if (announcement) {
                    setFormData({
                        title: announcement.title,
                        content: (parseText(announcement.content) as any) || emptyEditorContent,
                        isPublic: announcement.isPublic,
                        file: undefined
                    });
                    if (announcement.imageUrl) {
                        setPreviewUrl(announcement.imageUrl);
                    }
                }
            }
            setInitialLoading(false);
        };
        loadData();
    }, [id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: string[] = [];
        if (!formData.title.trim()) newErrors.push('El título es requerido.');

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (id) {
                await editAnnouncement(id, formData);
                Swal.fire('Actualizado', '✅ El aviso fue actualizado exitosamente.', 'success');
                navigate('/admin/announcements');
            }
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el aviso', 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    if (initialLoading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

    return (
        <article className="m-3 col-md-8 mx-auto">
            <div className="form-canto">
                <h3>Editar Aviso</h3>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Título del aviso"
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

                    <Form.Group className="mb-3" controlId="formPublic">
                        <Form.Check
                            type="checkbox"
                            name="isPublic"
                            label="¿Publicado?"
                            checked={formData.isPublic}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Imagen del aviso</Form.Label>
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
                            {loading ? <Spinner animation="border" size="sm" /> : 'Guardar cambios'}
                        </Button>
                        <Button
                            className="ms-2"
                            variant="secondary"
                            onClick={() => navigate('/admin/announcements')}
                        >
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};