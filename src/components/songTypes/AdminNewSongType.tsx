import { useState, useEffect } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSongTypeStore } from '../../store/admin/useSongTypeStore';

interface FormState {
    name: string;
    order: number;
    isParent: boolean;
    parentId: string;
}

export const AdminNewSongType = () => {
    const navigate = useNavigate();
    const { addType, types, loading, fetchTypes } = useSongTypeStore();

    const [formData, setFormData] = useState<FormState>({
        name: '',
        order: 99,
        isParent: false,
        parentId: ''
    });

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type, checked } = target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'order' ? parseInt(value) : value)
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { name, order, isParent, parentId } = formData;

        if (!name.trim()) {
            Swal.fire('Campo requerido', 'El nombre es obligatorio.', 'warning');
            return;
        }

        const exists = types.some(t => t.name.toLowerCase() === name.trim().toLowerCase());
        if (exists) {
            Swal.fire('Duplicado', 'Ya existe un tipo de canto con ese nombre.', 'warning');
            return;
        }

        try {
            await addType(name.trim(), order, parentId || null, isParent);
            Swal.fire('Creado', 'Tipo de canto creado con éxito.', 'success');
            navigate('/admin/song-types');
        } catch (err) {
            Swal.fire('Error', 'Hubo un problema al crear el tipo.', 'error');
        }
    };

    const parentOptions = types.filter(t => t.isParent);

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Nuevo Tipo de Canto</h2>
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre del tipo</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ej. Entrada, Comunión..."
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Orden (opcional)</Form.Label>
                    <Form.Control
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        placeholder="Ej. 1, 2, 3..."
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="¿Es una categoría padre? (Ej. Ordinario)"
                        name="isParent"
                        checked={formData.isParent}
                        onChange={handleChange}
                    />
                </Form.Group>

                {!formData.isParent && (
                    <Form.Group className="mb-4">
                        <Form.Label>Categoría Padre (Opcional)</Form.Label>
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

                <div className="d-flex justify-content-center">
                    <Button
                        type="submit"
                        className="general_btn"
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Crear Tipo'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};