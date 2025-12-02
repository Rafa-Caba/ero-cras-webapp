import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { registerUser } from '../../services/auth';

export const AdminRegister = () => {
    const navigate = useNavigate();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [file, setFile] = useState<File | undefined>(undefined);
    const [errores, setErrores] = useState<string[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'file' && files && files[0]) {
            const selectedFile = files[0];
            setFile(selectedFile);
            console.log({ file });

            setPreviewUrl(URL.createObjectURL(selectedFile));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData.name.trim()) newErrors.push('El nombre es requerido.');
        if (!formData.username.trim()) newErrors.push('El usuario es requerido.');
        if (!formData.email.trim()) newErrors.push('El correo es requerido.');
        if (!formData.password) newErrors.push('La contraseña es requerida.');
        if (formData.password !== formData.confirmPassword) newErrors.push('Las contraseñas no coinciden.');

        if (newErrors.length > 0) {
            setErrores(newErrors);
            return;
        }

        try {
            const payload = {
                name: formData.name,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                instrument: ''
            };

            await registerUser(payload);

            Swal.fire('¡Registrado!', 'Usuario creado con éxito. Por favor inicia sesión.', 'success');
            navigate('/auth/login');

        } catch (error: any) {
            const msg = error.response?.data?.message || 'Error al registrar usuario';
            Swal.fire('Error', msg, 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <main className='layout-main primary-color-container mx-3'>
            <Container className="mt-4 d-flex flex-column justify-content-center col-12 col-md-6">
                <Image
                    src={'/images/erocrasLogo.png'}
                    roundedCircle
                    height={150}
                    width={150}
                    alt={`Ero Cras Official`}
                    style={{
                        objectFit: 'cover',
                        border: '3px solid purple',
                        margin: '.3rem'
                    }}
                    className="text-center mx-auto mb-5"
                />
                <h3>Registrar Usuario</h3>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formName">
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
                            placeholder="Username"
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

                    {/* Image Upload (Preview only, actual upload requires auth token usually) */}
                    {/* If backend supports public registration with image, we need to adjust service */}
                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Foto de perfil (Opcional, se puede agregar después)</Form.Label>
                        <Form.Control
                            type="file"
                            name="file"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {previewUrl && (
                        <div className="text-center mb-3">
                            <Image src={previewUrl} roundedCircle width={100} height={100} style={{ objectFit: 'cover' }} />
                        </div>
                    )}

                    {errores.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errores.map((error, i) => <li key={i}>{error}</li>)}
                            </ul>
                        </div>
                    )}

                    <div className='text-center mb-3'>
                        <Button type="submit" className="general_btn">Registrar</Button>
                    </div>

                    <p className="d-flex flex-column text-center">
                        ¿Ya tienes cuenta?
                        <Link className="derecha" to="/auth/login">Iniciar Sesión</Link>
                    </p>
                </Form>
            </Container>
        </main>
    );
};