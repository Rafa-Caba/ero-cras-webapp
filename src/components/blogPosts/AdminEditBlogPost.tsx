import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useBlogPostsStore } from '../../store/admin/useBlogPostsStore';
import type { BlogPostForm } from '../../types';

type InputOrSelectEvent = ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export const AdminEditBlogPost = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const {
        fetchPostPorId,
        actualizarPostExistente
    } = useBlogPostsStore();

    const [formData, setFormData] = useState<BlogPostForm>({
        titulo: '',
        contenido: '',
        autor: '',
        publicado: true,
        imagen: null
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errores, setErrores] = useState<string[]>([]);

    useEffect(() => {
        const cargarDatos = async () => {
            if (id) {
                const post = await fetchPostPorId(id);
                setFormData({
                    titulo: post.titulo,
                    contenido: post.contenido,
                    autor: post.autor,
                    publicado: post.publicado,
                    imagen: null
                });
                setPreviewUrl(post.imagenUrl || null);
            }
        };
        cargarDatos();
    }, [id]);

    const handleChange = (e: InputOrSelectEvent) => {
        const target = e.target as HTMLInputElement;
        const { name, value, files } = target;

        if (name === 'imagen' && files && files[0]) {
            const file = files[0];
            setFormData({ ...formData, imagen: file });
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const erroresValidacion: string[] = [];

        if (!formData.titulo.trim()) erroresValidacion.push('El título es requerido.');
        if (!formData.contenido.trim()) erroresValidacion.push('El contenido es requerido.');
        if (!formData.autor.trim()) erroresValidacion.push('El autor es requerido.');

        if (erroresValidacion.length > 0) {
            setErrores(erroresValidacion);
            return;
        }

        const payload = new FormData();
        payload.append('titulo', formData.titulo);
        payload.append('contenido', formData.contenido);
        payload.append('autor', formData.autor);
        payload.append('publicado', formData.publicado ? 'true' : 'false');

        if (formData.imagen) {
            payload.append('imagen', formData.imagen);
        }

        try {
            if (id) await actualizarPostExistente(id, payload);

            Swal.fire('Actualizado', '✅ El post fue actualizado', 'success');
            navigate('/admin/blogposts');
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
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
                <h3>Editar BlogPost</h3>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="titulo"
                            value={formData.titulo}
                            onChange={handleChange}
                            placeholder="Título del post"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contenido</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="contenido"
                            value={formData.contenido}
                            onChange={handleChange}
                            placeholder="Contenido del post"
                            rows={6}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Autor</Form.Label>
                        <Form.Control
                            type="text"
                            name="autor"
                            value={formData.autor}
                            onChange={handleChange}
                            placeholder="Nombre del autor"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPublicado">
                        <Form.Check
                            type="checkbox"
                            name="publicado"
                            label="¿Publicado?"
                            checked={formData.publicado}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Imagen de imagen</Form.Label>
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
                                {errores.map((err, i) => (
                                    <li key={i}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="text-center">
                        <Button type="submit" className="general_btn">
                            Guardar cambios
                        </Button>
                        <Button
                            variant="secondary"
                            className="ms-2"
                            onClick={() => navigate('/admin/blogposts')}
                        >
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
