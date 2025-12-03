import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useSongTypeStore } from '../../store/admin/useSongTypeStore';

interface FormState {
    name: string;
    order: number | string;
    isParent: boolean;
    parentId: string;
}

export const AdminEditSongType = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        types,
        getType,
        editType,
        fetchTypes
    } = useSongTypeStore();

    const [formData, setFormData] = useState<FormState>({
        name: '',
        order: 99,
        isParent: false,
        parentId: ''
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            await fetchTypes();

            // Load current type
            const type = await getType(id);
            if (!type) {
                Swal.fire('Error', 'Tipo de canto no encontrado', 'error');
                navigate('/admin/song-types');
                return;
            }

            setFormData({
                name: type.name,
                order: type.order,
                isParent: type.isParent,
                parentId: type.parentId || ''
            });

            setLoading(false);
        };

        loadData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'order' ? (value === '' ? '' : parseInt(value)) : value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Duplicate check
        const exists = types.some(tipo =>
            tipo.id !== id &&
            tipo.name.toLowerCase().trim() === formData.name.toLowerCase().trim() &&
            (tipo.parentId || "") === (formData.parentId || "")
        );

        if (exists) {
            Swal.fire('Duplicado', 'Ya existe un tipo de canto con ese nombre en esta carpeta.', 'warning');
            return;
        }

        try {
            const finalOrder = formData.order === '' ? 0 : Number(formData.order);

            await editType(id!, formData.name, finalOrder, formData.isParent);

            Swal.fire('Actualizado', 'El tipo de canto se actualizó con éxito.', 'success');
            navigate('/admin/song-types');
        } catch (err) {
            Swal.fire('Error', 'No se pudo actualizar el tipo.', 'error');
        }
    };

    // Filter parents: Types that are parents AND not self (prevent circular)
    const parentOptions = types.filter(t => t.isParent && t.id !== id);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Editar Tipo de Canto</h2>

            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Orden</Form.Label>
                    <Form.Control
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="¿Es una categoría padre?"
                        name="isParent"
                        checked={formData.isParent}
                        onChange={handleChange}
                    />
                </Form.Group>

                {!formData.isParent && (
                    <Form.Group className="mb-4">
                        <Form.Label>Categoría Padre</Form.Label>
                        <Form.Select
                            name="parentId"
                            value={formData.parentId}
                            onChange={handleChange}
                        >
                            <option value="">-- Ninguna --</option>
                            {parentOptions.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                )}

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" className='px-3' style={{ borderRadius: 10 }} onClick={() => navigate('/admin/song-types')}>
                        Cancelar
                    </Button>
                    <Button type="submit" className="general_btn">
                        Guardar Cambios
                    </Button>
                </div>
            </Form>
        </div>
    );
};