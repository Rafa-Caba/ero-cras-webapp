import { useEffect, useState, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Form, Button, Spinner, Image } from 'react-bootstrap';
import { useGalleryStore } from '../../store/admin/useGalleryStore';

export const AdminEditMedia = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getImage, editImage, loading } = useGalleryStore();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [newFile, setNewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            if (id) {
                const data = await getImage(id);
                if (data) {
                    setTitle(data.title);
                    setDescription(data.description);
                    setPreviewUrl(data.imageUrl);
                }
                setInitialLoading(false);
            }
        };
        fetchImage();
    }, [id]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description) {
            Swal.fire('Campos requeridos', 'Llena todos los campos', 'warning');
            return;
        }

        const formData = new FormData();
        const dataPayload = { title, description };

        formData.append('data', JSON.stringify(dataPayload));

        if (newFile) {
            formData.append('file', newFile);
        }

        try {
            await editImage(id || '', formData);
            Swal.fire('Éxito', 'Imagen actualizada correctamente', 'success');
            navigate(`/admin/gallery/media/${id}`);
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
        }
    };

    if (initialLoading) return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;

    return (
        <div className='m-3 col-md-6 mx-auto'>
            <div className="form-canto">
                <h2 className="mb-4">Editar Imagen</h2>
                <Form className="w-100 px-3" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Título de la imagen"
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descripción de la imagen"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Nueva imagen (opcional)</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                    </Form.Group>

                    {previewUrl && (
                        <div className="mb-4 text-center">
                            <Image src={previewUrl} alt="Vista previa" fluid style={{ maxHeight: '300px' }} rounded />
                        </div>
                    )}

                    <div className="d-flex justify-content-center my-3">
                        <Button type="submit" className="general_btn me-3" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(`/admin/gallery/media/${id}`)}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};