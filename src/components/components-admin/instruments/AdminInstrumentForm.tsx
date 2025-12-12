import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Form,
    Button,
    Container,
    Row,
    Col,
    Card,
    Image
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useInstrumentsStore } from '../../../store/admin/useInstrumentsStore';
import type { CreateInstrumentPayload, Instrument } from '../../../types/instrument';

export const AdminInstrumentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const {
        instruments,
        fetchInstruments,
        fetchInstrumentById,
        saveInstrumentAction
    } = useInstrumentsStore();

    const [formData, setFormData] = useState<CreateInstrumentPayload>({
        name: '',
        slug: '',
        category: '',
        iconKey: '',
        isActive: true,
        order: 0
    });

    const [file, setFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Load instrument data on edit
    useEffect(() => {
        const loadData = async () => {
            if (!isEdit || !id) return;

            // Try from state first
            let instrument: Instrument | undefined | null =
                instruments.find(inst => inst.id === id);

            if (!instrument) {
                instrument = await fetchInstrumentById(id);
            }

            if (instrument) {
                setFormData({
                    name: instrument.name,
                    slug: instrument.slug,
                    category: instrument.category || '',
                    iconKey: instrument.iconKey,
                    isActive: instrument.isActive,
                    order: instrument.order ?? 0
                });
                setPreviewUrl(instrument.iconUrl || '');
            }
        };

        void loadData();
    }, [id, isEdit, instruments, fetchInstrumentById]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'isActive') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, isActive: checked }));
            return;
        }

        if (name === 'order') {
            const parsed = parseInt(value, 10);
            setFormData(prev => ({ ...prev, order: isNaN(parsed) ? 0 : parsed }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.slug.trim() || !formData.iconKey.trim()) {
            return Swal.fire(
                'Error',
                'Por favor completa Nombre, Slug e Icon Key (requeridos).',
                'error'
            );
        }

        setLoading(true);
        try {
            await saveInstrumentAction(formData, file, id);

            Swal.fire(
                'Éxito',
                `Instrumento ${isEdit ? 'actualizado' : 'creado'} correctamente`,
                'success'
            );

            // Refresh list in background
            void fetchInstruments();

            navigate('/admin/instruments');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el instrumento', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-white">
                    <h3 className="mb-0">
                        {isEdit ? 'Editar Instrumento' : 'Nuevo Instrumento'}
                    </h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Row>
                            {/* Left Column - Fields */}
                            <Col md={8}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Nombre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="slug">
                                            <Form.Label>Slug *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="slug"
                                                placeholder="guitarra-acustica"
                                                value={formData.slug}
                                                onChange={handleChange}
                                                required
                                            />
                                            <Form.Text muted>
                                                Identificador único (sin espacios).
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="iconKey">
                                            <Form.Label>Icon Key *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="iconKey"
                                                placeholder="guitar, piano, drums..."
                                                value={formData.iconKey}
                                                onChange={handleChange}
                                                required
                                            />
                                            <Form.Text muted>
                                                Clave para tu sistema de íconos / ilustraciones.
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="category">
                                            <Form.Label>Categoría</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="category"
                                                placeholder="Cuerdas, Viento, Percusión..."
                                                value={formData.category || ''}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3}>
                                        <Form.Group className="mb-3" controlId="order">
                                            <Form.Label>Orden</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="order"
                                                value={formData.order ?? 0}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={3} className="d-flex align-items-center">
                                        <Form.Group className="mb-3 w-100" controlId="isActive">
                                            <Form.Check
                                                type="switch"
                                                name="isActive"
                                                label="Activo"
                                                checked={formData.isActive ?? true}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>

                            {/* Right Column - Icon Preview */}
                            <Col md={4} className="text-center">
                                <Form.Label>Ícono del Instrumento</Form.Label>
                                <div className="mb-3 d-flex justify-content-center">
                                    <div
                                        style={{
                                            width: 150,
                                            height: 150,
                                            overflow: 'hidden',
                                            borderRadius: 20,
                                            border: '2px dashed #ccc',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f9f9f9'
                                        }}
                                    >
                                        {previewUrl ? (
                                            <Image
                                                src={previewUrl}
                                                alt="Icon preview"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain'
                                                }}
                                            />
                                        ) : (
                                            <span className="text-muted small">
                                                Sin icono seleccionado
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <Form.Group controlId="file">
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        size="sm"
                                    />
                                    <Form.Text muted>
                                        Opcional. Puedes subir una ilustración del instrumento.
                                    </Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="secondary"
                                className="me-2 px-3"
                                style={{ borderRadius: 10 }}
                                onClick={() => navigate('/admin/instruments')}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                className="general_btn"
                                disabled={loading}
                            >
                                {loading
                                    ? 'Guardando...'
                                    : isEdit
                                        ? 'Actualizar Instrumento'
                                        : 'Crear Instrumento'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};
