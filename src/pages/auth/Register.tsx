import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AdminFooter } from '../../components/components-admin/AdminFooter';
import { useAuth } from '../../context/AuthContext';

export const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        choirCode: '',
    });
    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (errors.length > 0) setErrors([]);

        if (name === 'file' && files && files[0]) {
            const selectedFile = files[0];
            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData.name.trim()) newErrors.push('El nombre es requerido.');
        if (!formData.username.trim()) newErrors.push('El usuario es requerido.');
        if (!formData.email.trim()) newErrors.push('El correo es requerido.');
        if (!formData.password) newErrors.push('La contraseña es requerida.');
        if (formData.password !== formData.confirmPassword) {
            newErrors.push('Las contraseñas no coinciden.');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await register({
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                instrument: '',
                choirCode: formData.choirCode || undefined,
            });

            Swal.fire(
                '¡Registrado!',
                'Usuario creado con éxito. Por favor inicia sesión.',
                'success'
            );
            navigate('/auth/login');
        } catch (error: any) {
            const msg = error?.response?.data?.message || 'Error al conectar con el servidor';
            Swal.fire('Error', msg, 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div className='primary-color-container'>
            <header className="layout-header primary-color-container">
                <div className="titulo-nav px-0 col-12 d-flex flex-column">
                    <div className="titulo mx-5 text-black d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
                        <div className="titulo text-center text-md-start d-flex flex-column flex-md-row justify-content-between mt-3 w-100">
                            <h2 className="mb-0">Ero Cras Oficial - Admin</h2>
                            {/* <Link
                                className="btn general_btn mt-3 mt-md-0 mb-md-2 fw-bold fs-6 fs-md-5"
                                to="/"
                            >
                                Ir al Inicio
                            </Link> */}
                        </div>
                    </div>
                </div>
            </header>

            <main className="layout-main primary-color-container mx-3">
                <Container className="mt-2 d-flex flex-column justify-content-center col-12 col-md-6">
                    <Image
                        src={'/images/erocrasLogo.png'}
                        roundedCircle
                        height={100}
                        width={100}
                        alt={`Ero Cras Official`}
                        style={{ objectFit: 'cover', border: '3px solid purple', margin: '.3rem' }}
                        className="text-center mx-auto mb-3"
                    />
                    <h3>Registrar Usuario</h3>

                    <Form className='p-4' onSubmit={handleSubmit}>
                        <Form.Group className="mb-2" controlId="formName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Nombre Completo"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Usuario</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Usuario"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        {/* 🆕 Código de coro opcional */}
                        <Form.Group className="mb-3" controlId="formChoirCode">
                            <Form.Label>Código de Coro (Opcional)</Form.Label>
                            <Form.Control
                                type="text"
                                name="choirCode"
                                placeholder="Ej. eroc1"
                                value={formData.choirCode}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-muted">
                                Déjalo vacío para registrarte en el coro principal de Ero Cras.
                                Usa el código sólo si te lo compartieron para otro coro.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <Form.Label>Repetir Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Repetir Contraseña"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formFile">
                            <Form.Label>Foto de perfil (Opcional)</Form.Label>
                            <Form.Control
                                type="file"
                                name="file"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </Form.Group>

                        {previewUrl && (
                            <div className="text-center mb-3">
                                <Image
                                    src={previewUrl}
                                    roundedCircle
                                    width={100}
                                    height={100}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        {errors.length > 0 && (
                            <div className="alert alert-danger">
                                <ul className="mb-0">
                                    {errors.map((error, i) => (
                                        <li key={i}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="text-center mb-2">
                            <Button type="submit" className="general_btn">
                                Registrar
                            </Button>
                        </div>

                        <p className="d-flex flex-column text-center mb-0">
                            ¿Ya tienes cuenta?
                            <Link className="derecha" to="/auth/login">
                                Iniciar Sesión
                            </Link>
                        </p>
                    </Form>
                </Container>
            </main>

            <AdminFooter />
        </div>
    );
};
