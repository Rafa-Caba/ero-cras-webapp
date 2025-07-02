import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Image, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { crearImagen } from "../../services/gallery";
import type { NuevaImagenForm } from "../../types";

export const AdminNewPhoto = () => {
    const [formData, setFormData] = useState<NuevaImagenForm>({
        titulo: '',
        descripcion: '',
        imagen: null
    });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({ ...prev, imagen: file }));

        if (file) {
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
        if (!formData.titulo || !formData.descripcion || !formData.imagen) {
            Swal.fire("Campos requeridos", "Llena todos los campos", "warning");
            return;
        }

        setCargando(true);
        try {
            const formPayload = new FormData();
            formPayload.append('titulo', formData.titulo);
            formPayload.append('descripcion', formData.descripcion);
            if (formData.imagen) formPayload.append('imagen', formData.imagen);

            await crearImagen(formPayload);

            Swal.fire("¡Éxito!", "Imagen subida correctamente", "success");
            navigate('/admin/gallery');
        } catch (error) {
            Swal.fire("Error", "No se pudo subir la imagen", "error");
        } finally {
            setCargando(false);
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
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Título de la imagen"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="descripcion"
                            value={formData.descripcion}
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
                        />
                    </Form.Group>

                    <Button className="btn general_btn mt-3" type="submit" disabled={cargando}>
                        {cargando ? <Spinner animation="border" size="sm" /> : 'Subir Imagen'}
                    </Button>
                    <Link className="btn btn-secondary mt-3 ms-2" type="submit" to='/admin/gallery'>
                        Cancelar
                    </Link>
                </Form>
            </div>
        </article>
    );
};
