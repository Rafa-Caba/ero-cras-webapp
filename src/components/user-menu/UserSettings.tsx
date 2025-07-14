import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useUsuariosStore } from '../../store/admin/useUsuariosStore';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

export const UserSettings = () => {
    const { user, updateUser } = useAuth();
    const { actualizarUsuarioLogueado } = useUsuariosStore();

    const [formData, setFormData] = useState({
        nombre: '',
        username: '',
        correo: '',
        fotoPerfilUrl: ''
    });

    const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre || '',
                username: user.username || '',
                correo: user.correo || '',
                fotoPerfilUrl: user.fotoPerfilUrl || ''
            });
            setPreviewUrl(user.fotoPerfilUrl || null);
        }
    }, [user]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;

        if (target.type === 'file') {
            const file = target.files?.[0];
            if (file) {
                setFotoPerfil(file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else {
            const { name, value } = target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?._id) return;

        const formPayload = new FormData();
        formPayload.append('nombre', formData.nombre);
        formPayload.append('username', formData.username);
        formPayload.append('correo', formData.correo);
        if (fotoPerfil) formPayload.append('fotoPerfil', fotoPerfil);

        try {
            const actualizado = await actualizarUsuarioLogueado(user._id, formPayload);
            updateUser(actualizado);
            Swal.fire('Actualizado', '✅ Datos actualizados con éxito', 'success');
        } catch (error) {
            Swal.fire('Error', '❌ No se pudo actualizar el usuario', 'error');
        }
    };

    return (
        <Container className="m-3 col-md-6 mx-auto">
            <h3>Ajustes del Usuario</h3>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                        type="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {previewUrl && (
                    <div className="mb-3 mt-4 text-center">
                        <Image src={previewUrl} roundedCircle width={150} alt="Vista previa" />
                    </div>
                )}

                <Form.Group className="mb-3">
                    <Form.Label>Foto de perfil (opcional)</Form.Label>
                    <Form.Control
                        type="file"
                        name="fotoPerfil"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </Form.Group>

                <div className="text-center">
                    <Button type="submit" className="general_btn">
                        Guardar cambios
                    </Button>
                    <Link to="/admin" className="btn btn-secondary px-3 ms-2">Ir al Inicio</Link>
                </div>
            </Form>
        </Container>
    );
};