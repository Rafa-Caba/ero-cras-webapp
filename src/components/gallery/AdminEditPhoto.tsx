import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Form, Button } from 'react-bootstrap';
import type { ImagenGaleria } from '../../types';
import { actualizarImagen, obtenerImagenPorId } from '../../services/gallery';

export const AdminEditPhoto = () => {
    const { id } = useParams<{ id: string }>();

    const [imagen, setImagen] = useState<ImagenGaleria | null>(null);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [nuevaImagen, setNuevaImagen] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImagen = async () => {
            try {
                const data = await obtenerImagenPorId(id || '');
                setImagen(data);
                setTitulo(data.titulo);
                setDescripcion(data.descripcion);
                setPreviewUrl(data.imagenUrl);
            } catch (err) {
                Swal.fire('Error', 'No se pudo cargar la imagen', 'error');
            }
        };
        fetchImagen();
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNuevaImagen(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo || !descripcion) {
            Swal.fire('Campos requeridos', 'Llena todos los campos', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        if (nuevaImagen) formData.append('imagen', nuevaImagen);

        try {
            const { mensaje } = await actualizarImagen(id || '', formData);
            Swal.fire('Éxito', mensaje, 'success');

            navigate(`/admin/photo/${id}`);
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
        }
    };

    if (!imagen) return <p className="text-center mt-5">Cargando imagen...</p>;

    return (
        <div className="form-canto">
            <h2 className="mb-4">Editar Imagen</h2>
            <Form className="w-100 px-3" onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Título de la imagen"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción de la imagen"
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Nueva imagen (opcional)</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>

                {previewUrl && (
                    <div className="mb-4 text-center">
                        <img src={previewUrl} alt="Vista previa" className="img-fluid" style={{ maxHeight: '300px' }} />
                    </div>
                )}

                <div className="d-flex justify-content-center my-3">
                    <Button type="submit" className="general_btn me-3">
                        Guardar Cambios
                    </Button>
                    <Button variant="secondary" onClick={() => navigate(`/admin/photo/${id}`)}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </div>
    );
};
