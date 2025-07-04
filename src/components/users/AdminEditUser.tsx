import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useUsuariosStore } from '../../store/useUsuariosStore';
import type { UsuarioForm } from '../../types';

type InputOrSelectEvent = ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export const AdminEditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        fetchUsuarioPorId,
        actualizarUsuarioExistente
    } = useUsuariosStore();

    const [formData, setFormData] = useState<UsuarioForm>({
        nombre: '',
        username: '',
        correo: '',
        password: '',
        rol: 'viewer',
        fotoPerfil: null,
        fotoPerfilUrl: ''
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const cargarUsuario = async () => {
            if (!id) return;

            try {
                const usuario = await fetchUsuarioPorId(id);

                if (usuario) {
                    setFormData({
                        nombre: usuario.nombre,
                        username: usuario.username,
                        correo: usuario.correo,
                        password: '',
                        rol: usuario.rol || 'viewer',
                        fotoPerfil: null,
                        fotoPerfilUrl: usuario.fotoPerfilUrl
                    });
                    setPreviewUrl(usuario.fotoPerfilUrl || null);
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo obtener el usuario', 'error');
                setTimeout(() => navigate('/admin/users'), 1500);
            }
        };

        cargarUsuario();
    }, [id]);

    const handleChange = (e: InputOrSelectEvent) => {
        const target = e.target;

        if (target instanceof HTMLInputElement && target.type === 'file') {
            const file = target.files?.[0];
            if (file) {
                setFormData(prev => ({ ...prev, fotoPerfil: file }));
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else {
            const { name, value } = target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id) return;

        if (!formData.rol) {
            Swal.fire('Campo obligatorio', 'Por favor selecciona un rol', 'warning');
            return;
        }

        const formPayload = new FormData();
        formPayload.append('nombre', formData.nombre);
        formPayload.append('username', formData.username);
        formPayload.append('correo', formData.correo);
        formPayload.append('rol', formData.rol);
        if (formData.password) formPayload.append('password', formData.password);
        if (formData.fotoPerfil) formPayload.append('fotoPerfil', formData.fotoPerfil);

        try {
            await actualizarUsuarioExistente(id, formPayload);
            fetchUsuarioPorId(id)

            Swal.fire('Actualizado', '✅ Usuario actualizado exitosamente', 'success');
            navigate('/admin/users');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el usuario', 'error');
        }
    };

    return (
        <Container className="m-3 col-md-6 mx-auto">
            <h3>Editar Usuario</h3>

            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group className="mb-3" controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
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
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Nueva Contraseña (opcional)</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="rol">
                    <Form.Label>Rol de Usuario</Form.Label>
                    <Form.Select
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        required
                    >
                        <option value="">-- Selecciona un rol --</option>
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                    </Form.Select>
                </Form.Group>

                {previewUrl && (
                    <div className="mb-3 text-center">
                        <Image src={previewUrl} roundedCircle width={150} alt="Vista previa" />
                    </div>
                )}

                <Form.Group className="mb-3" controlId="formFile">
                    <Form.Label>Foto de perfil (opcional)</Form.Label>
                    <Form.Control
                        type="file"
                        name="fotoPerfil"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </Form.Group>

                <div className='text-center'>
                    <Button type="submit" className="general_btn">
                        Actualizar Usuario
                    </Button>
                    <Link to="/admin/users" className="btn btn-secondary ms-2">
                        Regresar a Usuarios
                    </Link>
                </div>
            </Form>
        </Container>
    );
};
