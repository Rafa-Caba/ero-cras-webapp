import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useThemeStore } from '../../store/admin/useThemeStore';
import type { CreateThemePayload } from '../../types/theme';

// Helper config to generate form fields
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

export const AdminNewTheme = () => {
    const navigate = useNavigate();
    const { addTheme, loading } = useThemeStore();

    const [formData, setFormData] = useState<CreateThemePayload>({
        name: '',
        isDark: false,
        primaryColor: '#6f42c1',
        accentColor: '#d63384',
        backgroundColor: '#ffffff',
        textColor: '#212529',
        cardColor: '#f8f9fa',
        buttonColor: '#6f42c1',
        navColor: '#ffffff',
        buttonTextColor: '#ffffff',
        secondaryTextColor: '#6c757d',
        borderColor: '#dee2e6'
    });

    const handleChange = (field: keyof CreateThemePayload, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            Swal.fire('Error', 'El nombre del tema es obligatorio.', 'error');
            return;
        }

        try {
            await addTheme(formData);
            Swal.fire('¡Creado!', 'Tema creado correctamente', 'success');
            navigate("/admin/themes");
        } catch {
            Swal.fire('Error', 'No se pudo crear el tema.', 'error');
        }
    };

    return (
        <Container className="my-4">
            <h2 className="text-center mb-4">Nuevo Tema</h2>
            <Form onSubmit={handleSubmit} className="border rounded p-4 shadow-sm form-color">
                <Row className="mb-3">
                    <Col md={8}>
                        <Form.Group>
                            <Form.Label>Nombre del Tema</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ej. Tema Oscuro"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4} className="d-flex align-items-center">
                        <Form.Check
                            type="switch"
                            id="isDark-switch"
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
                                <Form.Label className="small text-muted mb-1">{field.label}</Form.Label>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                        type="color"
                                        className="form-control-color"
                                        value={formData[field.key] as string}
                                        onChange={(e) => handleChange(field.key, e.target.value)}
                                        title="Elige un color"
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

                <div className="d-flex justify-content-center mt-4 gap-2">
                    <Button type="submit" className="general_btn" disabled={loading}>
                        {loading ? 'Guardando...' : 'Crear Tema'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/themes')}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};