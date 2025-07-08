import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useMiembrosStore } from '../../store/admin/useMiembrosStore';
import type { MiembroForm } from '../../types';

type InputOrSelectEvent = ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export const AdminNewMember = () => {
    const navigate = useNavigate();
    const { crearNuevoMiembro } = useMiembrosStore();

    const [formData, setFormData] = useState<MiembroForm>({
        nombre: '',
        instrumento: '',
        tieneVoz: false,
        fotoPerfil: null,
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
        } else if (name === 'tieneVoz') {
            setFormData({ ...formData, tieneVoz: value === 'true' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData.nombre.trim()) newErrors.push('El nombre es requerido.');
        if (!formData.instrumento.trim()) newErrors.push('El instrumento es requerido.');

        if (newErrors.length > 0) {
            setErrores(newErrors);
            return;
        }

        const formPayload = new FormData();
        formPayload.append('nombre', formData.nombre);
        formPayload.append('instrumento', formData.instrumento);
        formPayload.append('tieneVoz', formData.tieneVoz ? 'true' : 'false');
        if (formData.fotoPerfil) {
            formPayload.append('fotoPerfil', formData.fotoPerfil);
        }

        try {
            await crearNuevoMiembro(formPayload);

            Swal.fire('¡Miembro creado!', `✅ El miembro ha sido creado`, 'success');
            setFormData({
                nombre: '',
                instrumento: '',
                tieneVoz: false,
                fotoPerfil: null,
            });
            setPreviewUrl(null);
            setErrores([]);
            navigate("/admin/members");
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
        <article className="m-3 col-md-6 mx-auto">
            <div className="form-canto">
                <h3>Nuevo Miembro</h3>

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

                    <Form.Group className="mb-3" controlId="formInstrumento">
                        <Form.Label>Instrumento</Form.Label>
                        <Form.Control
                            type="text"
                            name="instrumento"
                            placeholder="Ej. Guitarra, Violín..."
                            value={formData.instrumento}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTieneVoz">
                        <Form.Label>¿Tiene Voz?</Form.Label>
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
                            Crear miembro
                        </Button>
                        <Button className="ms-2" variant="secondary" onClick={() => navigate("/admin/members")}>
                            Cancelar
                        </Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
