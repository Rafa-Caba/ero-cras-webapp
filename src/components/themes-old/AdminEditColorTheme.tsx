import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import type { Theme } from '../../types';
import { useThemesStore } from '../../store/admin/useThemesStore';
import { actualizarColorClass } from '../../services/themes';

export const AdminEditColorTheme = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getColorClassById, themes, loading } = useThemesStore();

    const [formData, setFormData] = useState<Theme | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    // const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                try {
                    const colorClass = await getColorClassById(id);
                    setFormData(colorClass);
                } catch (err) {
                    setError('Error al cargar la clase de color');
                }
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData || !id) return;

        const { nombre, colorClass, color } = formData;

        // Validaciones básicas
        if (!nombre || !colorClass || !color) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        // Verificar duplicados en colorClass (excluyendo el actual)
        const duplicado = themes.find(t =>
            t.colorClass === colorClass && t._id !== id
        );

        if (duplicado) {
            setError(`Ya existe una clase de color con el nombre "${colorClass}".`);
            return;
        }

        try {
            await actualizarColorClass(id, formData);
            setSuccess(true);
            setTimeout(() => navigate('/admin/themes'), 1000);
        } catch {
            setError('Error al guardar los cambios.');
        }
    };

    if (loading) return <div className='text-center my-5'><Spinner animation='border' /></div>;

    return (
        <Container className='my-4'>
            <h2 className='text-center mb-4'>Editar Clase de Color</h2>
            <Form onSubmit={handleSubmit} style={{ backgroundColor: '#fff' }} className='border p-4 rounded shadow-sm d-flex flex-column align-items-center justify-content-center'>
                <Form.Group className='mb-3'>
                    <Form.Label>Nombre legible</Form.Label>
                    <Form.Control
                        type='text'
                        name='nombre'
                        value={formData?.nombre || ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Clase CSS</Form.Label>
                    <Form.Control
                        type='text'
                        name='colorClass'
                        value={formData?.colorClass || ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                        type='color'
                        name='color'
                        value={formData?.color || '#000000'}
                        onChange={handleChange}
                    />
                </Form.Group>

                {error && <Alert variant='danger'>{error}</Alert>}
                {success && <Alert variant='success'>Guardado correctamente 🎉</Alert>}

                <div className='d-flex justify-content-center mt-4'>
                    <Button className='btn general_btn me-2' type='submit'>Guardar Cambios</Button>
                    <Button variant='secondary' onClick={() => navigate(-1)}>Cancelar</Button>
                </div>
            </Form>
        </Container>
    );
};
