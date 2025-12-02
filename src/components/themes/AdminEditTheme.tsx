import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useThemeStore } from '../../store/admin/useThemeStore';
import type { CreateThemePayload } from '../../types/theme';
import { applyThemeToDocument } from '../../utils/applyThemeToDocument';

// Same config array
const colorFields: { key: keyof CreateThemePayload; label: string }[] = [
    { key: 'primaryColor', label: 'Color Primario' },
    { key: 'accentColor', label: 'Color Acento' },
    { key: 'backgroundColor', label: 'Fondo Pantalla' },
    { key: 'cardColor', label: 'Fondo Tarjetas' },
    { key: 'navColor', label: 'Barra Navegación' },
    { key: 'textColor', label: 'Texto Principal' },
    { key: 'secondaryTextColor', label: 'Texto Secundario' },
    { key: 'buttonColor', label: 'Fondo Botones' },
    { key: 'buttonTextColor', label: 'Texto Botones' },
    { key: 'borderColor', label: 'Bordes' },
];

export const AdminEditTheme = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { getTheme, editTheme, loading } = useThemeStore();

    const [formData, setFormData] = useState<CreateThemePayload | null>(null);

    useEffect(() => {
        if (id) {
            getTheme(id).then(theme => {
                if (theme) {
                    setFormData({
                        name: theme.name,
                        isDark: theme.isDark,
                        primaryColor: theme.primaryColor,
                        accentColor: theme.accentColor,
                        backgroundColor: theme.backgroundColor,
                        textColor: theme.textColor,
                        cardColor: theme.cardColor,
                        buttonColor: theme.buttonColor,
                        navColor: theme.navColor,
                        buttonTextColor: theme.buttonTextColor,
                        secondaryTextColor: theme.secondaryTextColor,
                        borderColor: theme.borderColor
                    });
                }
            });
        }
    }, [id]);

    const handleChange = (field: keyof CreateThemePayload, value: string | boolean) => {
        if (!formData) return;

        const updated = { ...formData, [field]: value };
        setFormData(updated);

        // Live Preview: Apply changes immediately to see effect
        applyThemeToDocument(updated);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!id || !formData) return;

        if (!formData.name.trim()) {
            Swal.fire('Error', 'El nombre es obligatorio', 'error');
            return;
        }

        try {
            await editTheme(id, formData);
            Swal.fire('Actualizado', 'Tema actualizado correctamente', 'success');
            navigate('/admin/themes');
        } catch {
            Swal.fire('Error', 'No se pudo actualizar el tema', 'error');
        }
    };

    if (loading && !formData) {
        return <div className='text-center my-5'><Spinner animation='border' /></div>;
    }

    if (!formData) return null;

    return (
        <Container className='my-4'>
            <h2 className='text-center mb-4'>Editar Tema</h2>

            <Form onSubmit={handleSubmit} className='border p-4 rounded shadow-sm form-color'>
                <Row className="mb-3">
                    <Col md={8}>
                        <Form.Group>
                            <Form.Label>Nombre del Tema</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-end justify-content-center">
                        <Form.Check
                            type="switch"
                            id="edit-isDark"
                            label="¿Es Modo Oscuro?"
                            checked={formData.isDark}
                            onChange={(e) => handleChange('isDark', e.target.checked)}
                        />
                    </Col>
                </Row>

                <h5 className="mt-4 mb-3">Paleta de Colores</h5>
                <Row>
                    {colorFields.map((field) => (
                        <Col md={6} lg={4} key={field.key} className="mb-3">
                            <Form.Group>
                                <Form.Label className="small text-secondary mb-1">{field.label}</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                        type="color"
                                        className="form-control-color"
                                        value={formData[field.key] as string}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                    />
                                    <Form.Control
                                        type="text"
                                        size="sm"
                                        value={formData[field.key] as string}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                    />
                                </div>
                            </Form.Group>
                        </Col>
                    ))}
                </Row>

                <div className='d-flex justify-content-center mt-4 gap-2'>
                    <Button className='btn general_btn' type='submit' disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                    <Button variant='secondary' onClick={() => navigate('/admin/themes')}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};