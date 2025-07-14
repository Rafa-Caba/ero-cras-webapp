import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useThemeGroupsStore } from '../../store/admin/useThemeGroupsStore';

const CLASES_FIJAS = [
    { nombre: 'Color Primario', colorClass: 'primary', color: '#ead4ff' },
    { nombre: 'Color de Botón', colorClass: 'btn-general', color: '#a966ff' },
    { nombre: 'Color de los Menús Laterales', colorClass: 'side-menus', color: '#ead4ff' },
    { nombre: 'Color del Header', colorClass: 'header', color: '#cfaef9' },
    { nombre: 'Color del Footer', colorClass: 'footer', color: '#b68fe6' },
    { nombre: 'Color de la Navegación', colorClass: 'nav', color: '#f3e3fb' },
    { nombre: 'Hover del Botón General', colorClass: 'btn-general-hover', color: '#8a36f8' },
    { nombre: 'Color de la Navegación - Hover', colorClass: 'nav-link-hover', color: '#b68fe6' },
];

export const AdminNewThemeGroup = () => {
    const navigate = useNavigate();
    const { createNuevoGrupo, cargando } = useThemeGroupsStore();

    const [nombreGrupo, setNombreGrupo] = useState('');
    const [colores, setColores] = useState(CLASES_FIJAS);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleColorChange = (index: number, value: string) => {
        const nuevos = [...colores];
        nuevos[index].color = value;
        setColores(nuevos);
        setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!nombreGrupo.trim()) {
            setError('Debes ingresar un nombre para el grupo.');
            return;
        }

        try {
            await createNuevoGrupo({
                nombre: nombreGrupo,
                colores: colores.map(({ nombre, colorClass, color }) => ({ nombre, colorClass, color })),
            });
            setSuccess(true);
            setNombreGrupo('');
            navigate("/admin/theme-groups");
            setColores(CLASES_FIJAS);
        } catch {
            setError('No se pudo crear el grupo.');
        }
    };

    return (
        <Container className="my-4">
            <h2 className="text-center mb-4">Nuevo Tema</h2>
            <Form onSubmit={handleSubmit} className="border rounded p-4 shadow-sm bg-white">
                <Form.Group className="mb-4">
                    <Form.Label>Nombre del Grupo</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ej. Tema Oscuro"
                        value={nombreGrupo}
                        onChange={(e) => setNombreGrupo(e.target.value)}
                    />
                </Form.Group>

                {colores.map((color, index) => (
                    <Row className="mb-3" key={color.colorClass}>
                        <Col md={4}>
                            <Form.Label>{color.nombre}</Form.Label>
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                value={color.colorClass}
                                disabled
                                readOnly
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="color"
                                value={color.color}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => handleColorChange(index, e.target.value)}
                            />
                        </Col>
                    </Row>
                ))}

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Grupo creado correctamente 🎉</Alert>}

                <div className="d-flex justify-content-center mt-4 gap-2">
                    <Button type="submit" className="general_btn" disabled={cargando}>
                        {cargando ? 'Guardando...' : 'Crear Grupo'}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/theme-groups')}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};
