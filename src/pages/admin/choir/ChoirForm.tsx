// src/pages/admin/choir/ChoirForm.tsx
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useChoirsStore } from '../../../store/admin/useChoirsStore';
import type { CreateChoirPayload } from '../../../types/choir';

export const ChoirForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { saveChoirAction, getChoirByIdFromState, fetchChoir } = useChoirsStore();

    const isEdit = !!id;

    const [formData, setFormData] = useState<{
        name: string;
        code: string;
        description: string;
        isActive: boolean;
    }>({
        name: '',
        code: '',
        description: '',
        isActive: true
    });

    const [file, setFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!isEdit || !id) return;

            let choirToEdit = getChoirByIdFromState(id);

            if (!choirToEdit) {
                const fetched = await fetchChoir(id);
                choirToEdit = fetched ?? undefined;
            }

            if (choirToEdit) {
                setFormData({
                    name: choirToEdit.name,
                    code: choirToEdit.code,
                    description: choirToEdit.description || '',
                    isActive: choirToEdit.isActive
                });
                setPreviewUrl(choirToEdit.logoUrl || '');
            }
        };

        loadData();
    }, [id, isEdit, getChoirByIdFromState, fetchChoir]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
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

        if (!formData.name.trim() || !formData.code.trim()) {
            return Swal.fire('Error', 'Nombre y código son obligatorios', 'error');
        }

        setLoading(true);

        try {
            const payload: CreateChoirPayload = {
                name: formData.name.trim(),
                code: formData.code.trim(),
                description: formData.description.trim() || undefined,
                isActive: formData.isActive
            };

            await saveChoirAction(payload, file, id);

            Swal.fire(
                'Éxito',
                `Coro ${isEdit ? 'actualizado' : 'creado'} correctamente`,
                'success'
            );
            navigate('/admin/choirs');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el coro', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-white">
                    <h3 className="mb-0">{isEdit ? 'Editar Coro' : 'Nuevo Coro'}</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {/* Left Column */}
                            <Col md={8}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="name">
                                            <Form.Label>Nombre *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="code">
                                            <Form.Label>Código *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleChange}
                                                placeholder="ej. eroc1"
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Breve descripción del coro"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="isActive-switch"
                                        label="¿Coro activo?"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            {/* Right Column: Logo */}
                            <Col md={4} className="text-center">
                                <Form.Label>Logo del Coro</Form.Label>
                                <div className="mb-3 d-flex justify-content-center">
                                    <div
                                        style={{
                                            width: '150px',
                                            height: '150px',
                                            overflow: 'hidden',
                                            borderRadius: '50%',
                                            border: '3px solid #ddd'
                                        }}
                                    >
                                        <img
                                            src={
                                                previewUrl ||
                                                'https://via.placeholder.com/150?text=Coro'
                                            }
                                            alt="Preview"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                </div>
                                <Form.Group controlId="file">
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        size="sm"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                            <Button
                                variant="secondary"
                                className="me-2"
                                onClick={() => navigate('/admin/choirs')}
                            >
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Coro'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};
