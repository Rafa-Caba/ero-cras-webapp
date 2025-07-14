import { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useTiposCantoStore } from '../../store/admin/useTiposCantoStore';
import type { FormTipoCanto } from '../../types';

export const AdminNewTipoCanto = () => {
    const navigate = useNavigate();
    const { createTipo, tipos, loading } = useTiposCantoStore();

    const [formData, setFormData] = useState<FormTipoCanto>({
        nombre: '',
        orden: 99
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'orden' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { nombre, orden } = formData;

        if (!nombre.trim()) {
            Swal.fire('Campo requerido', 'El nombre es obligatorio.', 'warning');
            return;
        }

        const yaExiste = tipos.some(tipo => tipo.nombre.toLowerCase() === nombre.trim().toLowerCase());

        if (yaExiste) {
            Swal.fire('Duplicado', 'Ya existe un tipo de canto con ese nombre.', 'warning');
            return;
        }

        try {
            await createTipo({ nombre: nombre.trim(), orden });
            Swal.fire('Creado', 'Tipo de canto creado con éxito.', 'success');
            navigate('/admin/tipos-canto');
        } catch (err) {
            Swal.fire('Error', 'Hubo un problema al crear el tipo.', 'error');
        }
    };

    return (
        <div className="container my-4">
            <h2 className="text-center mb-4">Nuevo Tipo de Canto</h2>
            <Form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre del tipo</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        placeholder="Ej. Entrada, Comunión..."
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Orden (opcional)</Form.Label>
                    <Form.Control
                        type="number"
                        name="orden"
                        value={formData.orden}
                        onChange={handleChange}
                        placeholder="Ej. 1, 2, 3..."
                    />
                    <Form.Text className="text-muted">
                        Si no se especifica, se asignará 99 por defecto.
                    </Form.Text>
                </Form.Group>

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
