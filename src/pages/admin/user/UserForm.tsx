import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useUsersStore } from '../../../store/admin/useUsersStore';

export const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { saveUserAction, getUserById, fetchUsers } = useUsersStore();

    const isEdit = !!id;

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'VIEWER',
        instrument: '',
        bio: '',
        voice: false
    });

    const [file, setFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Load Data for Edit
    useEffect(() => {
        const loadData = async () => {
            if (isEdit) {
                let userToEdit = getUserById(id);

                if (!userToEdit) {
                    await fetchUsers();
                }

                if (userToEdit) {
                    setFormData({
                        name: userToEdit.name,
                        username: userToEdit.username,
                        email: userToEdit.email,
                        password: '',
                        confirmPassword: '',
                        role: userToEdit.role,
                        instrument: userToEdit.instrument || '',
                        bio: userToEdit.bio || '',
                        voice: userToEdit.voice || false
                    });
                    setPreviewUrl(userToEdit.imageUrl || '');
                }
            }
        };
        loadData();
    }, [id, isEdit]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
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

        // Validation
        if (!formData.name || !formData.username || !formData.email) {
            return Swal.fire('Error', 'Por favor completa los campos obligatorios (*)', 'error');
        }

        if (!isEdit && !formData.password) {
            return Swal.fire('Error', 'La contraseña es obligatoria para nuevos usuarios', 'error');
        }

        if (formData.password && formData.password !== formData.confirmPassword) {
            return Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        }

        setLoading(true);
        try {
            // Prepare Payload
            // Remove password fields if empty to avoid sending empty string
            const { confirmPassword, ...payload } = formData;
            if (!payload.password) delete (payload as any).password;

            await saveUserAction(payload, file, id);

            Swal.fire('Éxito', `Usuario ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
            navigate('/admin/users');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo guardar el usuario', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card className="shadow-sm">
                <Card.Header className="bg-white">
                    <h3 className="mb-0">{isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            {/* Left Column: Inputs */}
                            <Col md={8}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="name">
                                            <Form.Label>Nombre Completo *</Form.Label>
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
                                        <Form.Group controlId="username">
                                            <Form.Label>Usuario *</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Correo Electrónico *</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="role">
                                            <Form.Label>Rol *</Form.Label>
                                            <Form.Select
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="VIEWER">Viewer (Solo ver)</option>
                                                <option value="EDITOR">Editor (Gestionar contenido)</option>
                                                <option value="ADMIN">Admin (Control total)</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="instrument">
                                            <Form.Label>Instrumento</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="instrument"
                                                placeholder="Ej. Guitarra"
                                                value={formData.instrument}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="voice-switch"
                                        label="¿Es Cantante? (Voz)"
                                        name="voice"
                                        checked={formData.voice}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="bio">
                                    <Form.Label>Biografía</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <hr className="my-4" />

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="password">
                                            <Form.Label>{isEdit ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder={isEdit ? "••••••" : ""}
                                                required={!isEdit}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="confirmPassword">
                                            <Form.Label>Confirmar Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required={!isEdit || formData.password.length > 0}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Col>

                            {/* Right Column: Image */}
                            <Col md={4} className="text-center">
                                <Form.Label>Foto de Perfil</Form.Label>
                                <div className="mb-3 d-flex justify-content-center">
                                    <div style={{ width: '150px', height: '150px', overflow: 'hidden', borderRadius: '50%', border: '3px solid #ddd' }}>
                                        <img
                                            src={previewUrl || 'https://via.placeholder.com/150'}
                                            alt="Preview"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                            <Button variant="secondary" className="me-2" onClick={() => navigate('/admin/users')}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Guardando...' : 'Guardar Usuario'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};