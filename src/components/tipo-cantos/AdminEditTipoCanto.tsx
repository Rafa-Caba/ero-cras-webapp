import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Form, Spinner } from 'react-bootstrap';
import { useTiposCantoStore } from '../../store/admin/useTiposCantoStore';
import type { FormTipoCanto } from '../../types';

export const AdminEditTipoCanto = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        tipos,
        getTipoPorId,
        updateTipo,
        getTipos
    } = useTiposCantoStore();

    const [formData, setFormData] = useState<FormTipoCanto>({
        nombre: '',
        orden: 99
    });

    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarTipo = async () => {
            if (!id) return;

            const tipo = await getTipoPorId(id);
            if (!tipo) {
                Swal.fire('Error', 'Tipo de canto no encontrado', 'error');
                navigate('/admin/tipos-canto');
                return;
            }

            setFormData({
                nombre: tipo.nombre,
                orden: tipo.orden
            });

            await getTipos(); // para validación de duplicados
            setCargando(false);
        };

        cargarTipo();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'orden' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const yaExiste = tipos.some(tipo =>
            tipo._id !== id &&
            tipo.nombre.toLowerCase().trim() === formData.nombre.toLowerCase().trim()
        );

        if (yaExiste) {
            Swal.fire('Duplicado', 'Ya existe un tipo de canto con ese nombre.', 'warning');
            return;
        }

        try {
            await updateTipo(id!, formData);
            Swal.fire('Actualizado', 'El tipo de canto se actualizó con éxito.', 'success');
            navigate('/admin/tipos-canto');
        } catch (err) {
            Swal.fire('Error', 'No se pudo actualizar el tipo.', 'error');
        }
    };

    if (cargando) {
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
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-4">
                    <Form.Label>Orden</Form.Label>
                    <Form.Control
                        type="number"
                        name="orden"
                        value={formData.orden}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => navigate('/admin/tipos-canto')}>
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