import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { crearUsuario } from '../../services/usuarios';

interface UsuarioForm {
    nombre: string;
    username: string;
    correo: string;
    password: string;
    password2: string,
    fotoPerfil: File | null;
}

export const RegisterUser = () => {
    const navigate = useNavigate();

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<UsuarioForm>({
        nombre: '',
        username: '',
        correo: '',
        password: '',
        password2: '',
        fotoPerfil: null
    });
    const [errores, setErrores] = useState<string[]>([]);


    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;

        if (name === 'fotoPerfil' && files) {
            if (files[0]) {
                const objectUrl = URL.createObjectURL(files[0]);
                setPreviewUrl(objectUrl);
            } else {
                setPreviewUrl(null);
            }

            setFormData({ ...formData, fotoPerfil: files[0] });

        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        const formPayload = new FormData();

        if (!formData.nombre.trim()) newErrors.push('El nombre es requerido.');
        if (!formData.username.trim()) newErrors.push('El nombre de usuario es requerido.');
        if (!formData.password.trim()) newErrors.push('La contraseña es requerida.');
        if (formData.password !== formData.password2) newErrors.push('Las contraseñas no coinciden.');

        if (newErrors.length > 0) {
            setErrores(newErrors);
            return;
        }

        formPayload.append('nombre', formData.nombre);
        formPayload.append('username', formData.username);
        formPayload.append('correo', formData.correo);
        formPayload.append('password', formData.password);

        if (formData.fotoPerfil) {
            formPayload.append('fotoPerfil', formData.fotoPerfil);
        }

        try {
            const { mensaje } = await crearUsuario(formPayload);

            Swal.fire('¡Usuario registrado!', `✅ ${mensaje}`, 'success');
            setFormData({ nombre: '', username: '', correo: '', password: '', password2: '', fotoPerfil: null }); // opcional: limpiar formulario
            navigate('/admin/login');
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [formData.fotoPerfil]);

    return (
        <main className='layout-main mx-3'>
            <Container className="mt-4 d-flex flex-column justify-content-center col-12 col-md-6">
                <Image
                    src={'/images/erocrasLogo.png'}
                    roundedCircle
                    height={50}
                    width={50}
                    alt={`Ero Cras Official`}
                    style={{
                        objectFit: 'cover',
                        width: '170px',
                        height: '170px',
                        minWidth: '170px',
                        minHeight: '170px',
                        border: '3px solid purple',
                        margin: '.3rem'
                    }}
                    className="text-center mx-auto mb-5"
                />
                <h3>Registrar Usuario</h3>

                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Form.Group className="mb-3" controlId="formNombre">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            name="nombre"
                            placeholder="Nombre Completo"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formNombre">
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

                    <Form.Group className="mb-3" controlId="formCorreo">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control
                            type="email"
                            name="correo"
                            placeholder="Correo electrónico"
                            value={formData.correo}
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

                    <Form.Group className="mb-3" controlId="formPassword2">
                        <Form.Label>Repetir Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="password2"
                            placeholder="Repetir Contraseña"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {previewUrl && (
                        <div className="mt-3 text-center">
                            <p className="mb-2 fw-bold">Vista previa:</p>
                            <img
                                src={previewUrl}
                                alt={`Vista previa de la imagen: ${formData.username || "sin título"}`}
                                className="img-fluid rounded"
                                style={{ maxHeight: "250px" }}
                            />
                        </div>
                    )}
                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Foto de perfil</Form.Label>
                        <Form.Control
                            type="file"
                            name="fotoPerfil"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className='text-center mb-3'>
                        <Button type="submit" className="general_btn">Registrar</Button>
                    </div>

                    {errores.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errores.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <p className="d-flex flex-column">
                        ¿Ya tienes cuenta?
                        <a className="derecha" href="/admin/login">Iniciar Sesión</a>
                    </p>
                </Form>
            </Container>
        </main>
    );
};
