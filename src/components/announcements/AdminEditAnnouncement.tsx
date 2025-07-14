import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useAvisosStore } from '../../store/admin/useAvisosStore';
import type { AvisoForm } from '../../types';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { createHandleTextoChange, createUpdateFormData } from '../../utils/handleTextTipTap';

type InputOrSelectEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

export const AdminEditAnnouncement = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [formData, setFormData] = useState<AvisoForm | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errores, setErrores] = useState<string[]>([]);
    const {
        fetchAvisoPorId,
        actualizarAvisoExistente
    } = useAvisosStore();

    const setFormDataSafe: React.Dispatch<React.SetStateAction<AvisoForm | null>> = setFormData;

    const defaultFormData: AvisoForm = {
        titulo: '',
        contenido: emptyEditorContent,
        publicado: true,
        imagen: null
    };

    useEffect(() => {
        if (!formData) setFormData(defaultFormData);
    }, []);

    const updateFormData = createUpdateFormData<AvisoForm>()(setFormData);

    useEffect(() => {
        if (id) {
            fetchAvisoPorId(id).then((aviso) => {
                setFormData({
                    titulo: aviso.titulo,
                    contenido: aviso.contenido,
                    publicado: aviso.publicado,
                    imagen: null
                });
                if (aviso.imagenUrl) {
                    setPreviewUrl(aviso.imagenUrl);
                }
            }).catch(() => {
                Swal.fire('Error', 'No se pudo cargar el aviso', 'error');
                navigate('/admin/announcements');
            });
        }
    }, [id]);

    const handleChange = (e: InputOrSelectEvent) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, files, checked } = target;

        if (name === 'imagen' && files && files[0]) {
            const file = files[0];
            // setFormData({ ...formData, imagen: file });
            updateFormData({ imagen: file });
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        } else {
            const newValue = type === 'checkbox' ? checked : value;
            // setFormData({ ...formData, [name]: newValue });
            updateFormData({ [name]: newValue });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData) {
            setErrores(['Error interno: el formulario no está cargado.']);
            return;
        }

        if (!formData.titulo.trim()) newErrors.push('El título es requerido.');
        if (!formData.contenido) newErrors.push('El contenido es requerido.');

        if (newErrors.length > 0) {
            setErrores(newErrors);
            return;
        }

        const formPayload = new FormData();
        formPayload.append('titulo', formData.titulo);
        formPayload.append('contenido', JSON.stringify(formData.contenido));
        formPayload.append('publicado', formData.publicado ? 'true' : 'false');
        if (formData.imagen) {
            formPayload.append('imagen', formData.imagen);
        }

        try {
            if (id) {
                await actualizarAvisoExistente(id, formPayload);
                Swal.fire('Actualizado', '✅ El aviso fue actualizado exitosamente.', 'success');

                setFormData(defaultFormData);

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

    return (
        <article className="m-3 col-md-6 mx-auto">
            <div className="form-canto">
                <h3>Editar Aviso</h3>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3" controlId="formTitulo">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="titulo"
                            placeholder="Título del aviso"
                            value={formData?.titulo}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <TiptapEditor
                            content={formData?.contenido}
                            onChange={createHandleTextoChange<AvisoForm>(setFormDataSafe, 'contenido')}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPublicado">
                        <Form.Check
                            type="checkbox"
                            name="publicado"
                            label="¿Publicado?"
                            checked={formData?.publicado}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Imagen del aviso</Form.Label>
                        <Form.Control
                            type="file"
                            name="imagen"
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

                    {errores.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errores.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className='text-center'>
                        <Button type="submit" className="general_btn">
                            Guardar cambios
                        </Button>
                        <Button className='ms-2' variant="secondary" onClick={() => navigate("/admin/announcements")}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
