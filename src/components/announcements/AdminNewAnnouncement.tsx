// AdminNewAnnouncement.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useAvisosStore } from '../../store/admin/useAvisosStore';
import type { AvisoForm } from '../../types';


export const AdminNewAnnouncement = () => {
    const navigate = useNavigate();
    const { crearNuevoAviso } = useAvisosStore();

    const [formData, setFormData] = useState<AvisoForm>({
        titulo: '',
        contenido: '',
        publicado: true,
        imagen: null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errores, setErrores] = useState<string[]>([]);

    const handleChange = (e: any) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else if (type === 'file' && files[0]) {
            setFormData({ ...formData, imagen: files[0] });
            setPreviewUrl(URL.createObjectURL(files[0]));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData.titulo.trim()) newErrors.push('El título es obligatorio');
        if (!formData.contenido.trim()) newErrors.push('La descripción es obligatoria');

        if (newErrors.length > 0) {
            setErrores(newErrors);
            return;
        }

        const formPayload = new FormData();
        formPayload.append('titulo', formData.titulo);
        formPayload.append('contenido', formData.contenido);
        formPayload.append('publicado', formData.publicado ? 'true' : 'false');

        if (formData.imagen) {
            formPayload.append('imagen', formData.imagen);
        }

        try {
            await crearNuevoAviso(formPayload);
            Swal.fire('¡Aviso creado!', '', 'success');
            setFormData({
                titulo: '',
                contenido: '',
                publicado: true,
                imagen: null
            });
            setPreviewUrl(null);
            setErrores([]);
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
        <article className="m-3 col-md-6 mx-auto">
            <div className="form-canto">
                <h3>Nuevo Aviso</h3>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="contenido"
                            rows={4}
                            value={formData.contenido}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Publicado"
                            name="publicado"
                            checked={formData.publicado}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Imagen</Form.Label>
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
                        <Button type="submit" className="general_btn">Crear aviso</Button>
                        <Button className='ms-2' variant="secondary" onClick={() => navigate('/admin/announcements')}>Cancelar</Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
