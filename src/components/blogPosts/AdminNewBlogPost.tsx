import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useBlogPostsStore } from '../../store/admin/useBlogPostsStore';
import type { BlogPostForm } from '../../types';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { createHandleTextoChange } from '../../utils/handleTextTipTap';


type InputEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export const AdminNewBlogPost = () => {
    const navigate = useNavigate();
    const { crearNuevoPost } = useBlogPostsStore();
    const [formData, setFormData] = useState<BlogPostForm | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errores, setErrores] = useState<string[]>([]);

    const setFormDataSafe: React.Dispatch<React.SetStateAction<BlogPostForm | null>> = setFormData;

    const defaultFormData: BlogPostForm = {
        titulo: '',
        contenido: emptyEditorContent,
        autor: '',
        publicado: false,
        imagen: null
    };

    useEffect(() => {
        if (!formData) setFormData(defaultFormData);
    }, []);

    const updateFormData = (changes: Partial<BlogPostForm>) => {
        setFormData((prev) => (prev ? { ...prev, ...changes } : prev));
    };

    const handleChange = (e: InputEvent) => {
        const { name, type, value, checked, files } = e.target as HTMLInputElement;

        if (name === 'imagen' && files && files[0]) {
            const file = files[0];
            updateFormData({ imagen: file });
            setPreviewUrl(URL.createObjectURL(file));
        } else if (type === 'checkbox') {
            updateFormData({ [name]: checked });
        } else {
            updateFormData({ [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData) {
            setErrores(['Error interno: el formulario no está cargado.']);
            return;
        }

        if (!formData.titulo.trim()) newErrors.push('El título es obligatorio.');
        if (!formData.contenido) newErrors.push('El contenido no puede estar vacío.');
        if (!formData.autor.trim()) newErrors.push('El autor es obligatorio.');

        if (newErrors.length > 0) {
            setErrores(newErrors);
            return;
        }

        const formPayload = new FormData();
        formPayload.append('titulo', formData.titulo);
        formPayload.append('contenido', JSON.stringify(formData.contenido));
        formPayload.append('autor', formData.autor);
        formPayload.append('publicado', formData.publicado ? 'true' : 'false');

        if (formData.imagen) {
            formPayload.append('imagen', formData.imagen);
        }

        try {
            await crearNuevoPost(formPayload);
            Swal.fire('¡Post creado!', '✅ El post se ha creado exitosamente.', 'success');

            setFormData(defaultFormData);

            setPreviewUrl(null);
            setErrores([]);

            navigate('/admin/blogposts');
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
                    <Form.Group className="mb-3" controlId="formTitulo">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="titulo"
                            placeholder="Título del post"
                            value={formData?.titulo}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Contenido</Form.Label>
                        <TiptapEditor
                            content={formData?.contenido}
                            onChange={createHandleTextoChange<BlogPostForm>(setFormDataSafe, 'contenido')}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAutor">
                        <Form.Label>Autor</Form.Label>
                        <Form.Control
                            type="text"
                            name="autor"
                            placeholder="Nombre del autor"
                            value={formData?.autor}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Publicado"
                            name="publicado"
                            checked={formData?.publicado}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Imagen de portada</Form.Label>
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
                                style={{ maxHeight: '200px' }}
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

                    <div className="text-center">
                        <Button type="submit" className="general_btn">
                            Crear post
                        </Button>
                        <Button className="ms-2" variant="secondary" onClick={() => navigate('/admin/blogposts')}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
