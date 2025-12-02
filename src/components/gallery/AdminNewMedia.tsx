import { useState, type FormEvent, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Image, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useGalleryStore } from "../../store/admin/useGalleryStore";
import type { CreateGalleryPayload } from "../../types";

export const AdminNewMedia = () => {
    const { uploadImage } = useGalleryStore();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CreateGalleryPayload>({
        title: '',
        description: '',
        imageGallery: true,
        file: undefined
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, file: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.file) {
            Swal.fire("Campos requeridos", "Llena todos los campos obligatorios", "warning");
            return;
        }

        setLoading(true);
        try {
            await uploadImage(formData);

            Swal.fire("¡Éxito!", "Imagen subida correctamente", "success");
            navigate('/admin/gallery');
        } catch (error) {
            Swal.fire("Error", "No se pudo subir la imagen", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className="container col-md-8 p-4">
            <div className="form-photo">
                <h2 className="titulo mb-4">Nueva Imagen</h2>
                <Form className="w-100 px-4" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Título de la imagen"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Breve descripción"
                        />
                    </Form.Group>

                    {previewUrl && (
                        <div className="text-center mb-2">
                            <p className="text-muted mt-2 mb-2">Previsualización</p>
                            <Image src={previewUrl} thumbnail fluid style={{ maxHeight: '200px' }} />
                        </div>
                    )}

                    <Form.Group className="mb-4">
                        <Form.Label>Archivo de imagen</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                        />
                    </Form.Group>

                    <Button className="btn general_btn mt-3" type="submit" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Subir Imagen'}
                    </Button>
                    <Link className="btn btn-secondary mt-3 ms-2" to='/admin/gallery'>
                        Cancelar
                    </Link>
                </Form>
            </div>
        </article>
    );
};