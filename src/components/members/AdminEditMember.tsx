import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useMiembrosStore } from '../../store/useMiembrosStore';
import type { MiembroForm } from '../../types';

type InputOrSelectEvent = ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export const AdminEditMember = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        fetchMiembroPorId,
        actualizarMiembroExistente
    } = useMiembrosStore();

    const [formData, setFormData] = useState<MiembroForm>({
        nombre: '',
        instrumento: '',
        tieneVoz: false,
        fotoPerfil: null,
        fotoPerfilUrl: ''
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const cargarMiembro = async () => {
            if (!id) return;

            try {
                const miembro = await fetchMiembroPorId(id);

                if (miembro) {
                    setFormData({
                        nombre: miembro.nombre,
                        instrumento: miembro.instrumento,
                        tieneVoz: miembro.tieneVoz || false,
                        fotoPerfil: null,
                        fotoPerfilUrl: miembro.fotoPerfilUrl
                    });
                    setPreviewUrl(miembro.fotoPerfilUrl || null);
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo obtener el miembro', 'error');
                setTimeout(() => navigate('/admin/members'), 1500);
            }
        };

        cargarMiembro();
    }, [id]);

    const handleChange = (e: InputOrSelectEvent) => {
        const target = e.target;

        if (target instanceof HTMLInputElement && target.type === 'file') {
            const file = target.files?.[0];
            if (file) {
                setFormData(prev => ({ ...prev, fotoPerfil: file }));
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else if (target.name === 'tieneVoz') {
            setFormData(prev => ({ ...prev, tieneVoz: target.value === 'true' }));
        } else {
            const { name, value } = target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        const formPayload = new FormData();
        formPayload.append('nombre', formData.nombre);
        formPayload.append('instrumento', formData.instrumento);
        formPayload.append('tieneVoz', formData.tieneVoz ? 'true' : 'false');
        if (formData.fotoPerfil) formPayload.append('fotoPerfil', formData.fotoPerfil);

        try {
            await actualizarMiembroExistente(id, formPayload);
            Swal.fire('Actualizado', '✅ Miembro actualizado exitosamente', 'success');
            navigate('/admin/members');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el miembro', 'error');
        }
    };

    return (
        <Container className="m-3 col-md-6 mx-auto">
            <h3>Editar Miembro</h3>

            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group className="mb-3" controlId="formNombre">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formInstrumento">
                    <Form.Label>Instrumento</Form.Label>
                    <Form.Control
                        type="text"
                        name="instrumento"
                        value={formData.instrumento}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTieneVoz">
                    <Form.Label>¿Tiene voz?</Form.Label>
                    <Form.Select
                        name="tieneVoz"
                        value={formData.tieneVoz ? 'true' : 'false'}
                        onChange={handleChange}
                        required
                    >
                        <option value="false">No</option>
                        <option value="true">Sí</option>
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
                        Actualizar Miembro
                    </Button>
                    <Link to="/admin/members" className="btn btn-secondary ms-2">
                        Regresar a Miembros
                    </Link>
                </div>
            </Form>
        </Container>
    );
};
