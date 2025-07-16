import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useThemeGroupsStore } from '../../store/admin/useThemeGroupsStore';
import { useAuth } from '../../hooks/useAuth';
import type { ThemeGroup, ThemeGroupForm } from '../../types';
import { applyThemeGroupToDocument } from '../../utils/applyThemeGroupToDocument';

export const AdminEditThemeGroup = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        fetchGrupoPorId,
        grupoSeleccionado,
        actualizarGrupoExistente,
        cargando,
        error
    } = useThemeGroupsStore();

    const [formData, setFormData] = useState<ThemeGroupForm>({ nombre: '', colores: [] });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (id) fetchGrupoPorId(id);
    }, [id]);

    useEffect(() => {
        if (grupoSeleccionado) {
            setFormData({
                nombre: grupoSeleccionado.nombre,
                colores: grupoSeleccionado.colores.map(t => ({
                    nombre: t.nombre,
                    colorClass: t.colorClass,
                    color: t.color || '#000000'
                }))
            });
        }
    }, [grupoSeleccionado]);

    const handleChange = (index: number, value: string) => {
        const nuevosTemas = [...formData.colores];
        nuevosTemas[index].color = value;
        setFormData(prev => ({ ...prev, colores: nuevosTemas }));
    };

    function isThemeGroup(obj: any): obj is ThemeGroup {
        return obj && typeof obj === 'object' && '_id' in obj;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            await actualizarGrupoExistente(id, formData);
            setSuccess(true);

            // 🧠 Si es el tema que está usando actualmente el user, reactiva el contexto con él:
            if (isThemeGroup(user?.themePersonal) && user.themePersonal._id === id) {
                const grupoActualizado = await fetchGrupoPorId(id);

                if (grupoActualizado) {
                    applyThemeGroupToDocument(grupoActualizado); // actualiza el estilo
                }
            }

            setSuccess(true);
            setTimeout(() => navigate('/admin/theme-groups'), 1000);
        } catch {
            // ya se maneja error en el store
        }
    };
    if (cargando && !grupoSeleccionado) return <div className='text-center my-5'><Spinner animation='border' /></div>;

    return (
        <Container className='my-4'>
            <h2 className='text-center mb-4'>Editar Tema</h2>

            <Form onSubmit={handleSubmit} className='border p-4 rounded shadow-sm form-color'>
                <Form.Group className='mb-3'>
                    <Form.Label>Nombre del Grupo</Form.Label>
                    <Form.Control
                        type='text'
                        value={formData.nombre}
                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                </Form.Group>

                {formData.colores.map((color, index) => (
                    <Row key={index} className='mb-3 align-items-end'>
                        <Col md={5}>
                            <Form.Group>
                                <Form.Label>{color.nombre}</Form.Label>
                                <Form.Control type='text' value={color.nombre} disabled />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Nombre de clase</Form.Label>
                                <Form.Control type='text' value={color.colorClass} disabled />
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Color</Form.Label>
                                <Form.Control
                                    type='color'
                                    value={color.color}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                ))}

                {error && <Alert variant='danger'>{error}</Alert>}
                {success && <Alert variant='success'>Grupo actualizado correctamente 🎉</Alert>}

                <div className='d-flex justify-content-center mt-4'>
                    <Button className='btn general_btn me-2' type='submit' disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Button variant='secondary' onClick={() => navigate(-1)}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};
