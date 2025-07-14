import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import type { Theme } from '../../types/themes';
import { useThemesStore } from '../../store/admin/useThemesStore';

export const AdminNewColorTheme = () => {
    const navigate = useNavigate();
    const { createColorClass, loading } = useThemesStore();

    const [formData, setFormData] = useState<Theme>({
        nombre: '',
        colorClass: '',
        color: '#000000'
    });

    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.nombre || !formData.colorClass || !formData.color) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            await createColorClass(formData);
            setSuccess(true);
            setFormData({ nombre: '', colorClass: '', color: '#000000' });
        } catch (err) {
            setError('Error al crear la clase de color.');
        }
    };

    return (
        <Container className='my-4'>
            <h2 className='text-center mb-4'>Agregar Nueva Clase de Color</h2>
            <Form onSubmit={handleSubmit} style={{ backgroundColor: '#fff' }} className='border p-4 rounded shadow-sm'>
                <Row className='mb-3'>
                    <Col md={6}>
                        <Form.Group controlId='nombre'>
                            <Form.Label>Primario</Form.Label>
                            <Form.Control
                                type='text'
                                name='primario'
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder='Color de Primario'
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group controlId='colorClass'>
                            <Form.Label>Nombre de clase</Form.Label>
                            <Form.Control
                                type='text'
                                name='colorClass'
                                value={formData.colorClass}
                                onChange={handleChange}
                                placeholder='Ej: nav'
                            />
                        </Form.Group>
                    </Col>

                    <Col md={3}>
                        <Form.Group controlId='color'>
                            <Form.Label>Color</Form.Label>
                            <Form.Control
                                type='color'
                                name='color'
                                value={formData.color}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                {error && <Alert variant='danger'>{error}</Alert>}
                {success && <Alert variant='success'>Color agregado correctamente 🎉</Alert>}

                <div className='d-flex justify-content-center mt-4'>
                    <Button className='btn general_btn me-2' type='submit' disabled={loading}>
                        {loading ? 'Guardando...' : 'Agregar Color'}
                    </Button>
                    <Button variant='secondary' onClick={() => navigate('/admin/themes')}>
                        Regresar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};