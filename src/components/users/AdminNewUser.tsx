import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useUsuariosStore } from '../../store/admin/useUsuariosStore';
import type { UsuarioForm } from '../../types';

type InputOrSelectEvent = ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export const AdminNewUser = () => {
    const navigate = useNavigate();

    const { crearNuevoUsuario } = useUsuariosStore();
    const [formData, setFormData] = useState<UsuarioForm>({
        nombre: '',
        username: '',
        correo: '',
        password: '',
        password2: '',
        rol: 'viewer',
        fotoPerfil: null
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errores, setErrores] = useState<string[]>([]);

    const handleChange = (e: InputOrSelectEvent) => {
        const target = e.target as HTMLInputElement;
        const { name, value, files } = target;

        if (name === 'fotoPerfil' && files && files[0]) {
            const file = files[0];
            setFormData({ ...formData, fotoPerfil: file });
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData.nombre.trim()) newErrors.push('El nombre es requerido.');
        if (!formData.username.trim()) newErrors.push('El username es requerido.');
        if (!formData.correo.trim()) newErrors.push('El correo es requerido.');
        if (!formData.password.trim()) newErrors.push('La contraseña es requerida.');
        if (formData.password !== formData.password2) newErrors.push('Las contraseñas no coinciden.');

        if (!formData.rol) newErrors.push('Selecciona un rol de usuario.');

        if (newErrors.length > 0) {
            setErrores(newErrors);
            return;
        }

        const formPayload = new FormData();
        formPayload.append('nombre', formData.nombre);
        formPayload.append('username', formData.username.toLowerCase().trim());
        formPayload.append('correo', formData.correo);
        formPayload.append('password', formData.password);
        formPayload.append('rol', formData.rol);
        if (formData.fotoPerfil) {
            formPayload.append('fotoPerfil', formData.fotoPerfil);
        }

        try {
            await crearNuevoUsuario(formPayload);

            Swal.fire('¡Usuario creado!', `✅ El Usuario has sido creado`, 'success');
            setFormData({
                nombre: '',
                username: '',
                correo: '',
                password: '',
                password2: '',
                rol: 'viewer',
                fotoPerfil: null
            });
            setPreviewUrl(null);
            setErrores([]);
            navigate("/admin/users");
        } catch (error) {
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <article className="m-3 col-md-8 mx-auto">
            <div className="form-canto">
                <h3>Nuevo Usuario</h3>

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

                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="username"
                            placeholder="Nombre de usuario"
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
                            placeholder="Repite la contraseña"
                            value={formData.password2}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFile">
                        <Form.Label>Foto de perfil</Form.Label>
                        <Form.Control
                            type="file"
                            name="fotoPerfil"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {previewUrl && (
                        <div className="text-center mb-4">
                            <p className="fw-bold mb-2">Vista previa:</p>
                            <img
                                src={previewUrl}
                                alt="Vista previa"
                                className="img-fluid rounded"
                                style={{ maxHeight: '150px' }}
                            />
                        </div>
                    )}

                    {errores.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errores.map((error, i) => (
                                    <li key={i}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className='text-center'>
                        <Button type="submit" className="general_btn">
                            Crear usuario
                        </Button>
                        <Button className='ms-2' variant="secondary" onClick={() => navigate("/admin/users")}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
