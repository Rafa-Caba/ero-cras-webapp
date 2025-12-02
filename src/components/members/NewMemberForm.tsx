import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import type { CreateMemberPayload } from '../../types/member';
import { useMemberStore } from '../../store/admin/useMemberStore';

export const NewMemberForm = () => {
    const navigate = useNavigate();
    const { addMember } = useMemberStore();

    const [formData, setFormData] = useState<CreateMemberPayload>({
        name: '',
        instrument: '',
        voice: false,
        file: undefined,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, files } = target;

        if (name === 'file' && files && files[0]) {
            const file = files[0];
            setFormData({ ...formData, file: file });
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        } else if (name === 'voice') {
            setFormData({ ...formData, voice: value === 'true' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData.name.trim()) newErrors.push('El nombre es requerido.');
        if (!formData.instrument.trim()) newErrors.push('El instrumento es requerido.');

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addMember(formData);

            Swal.fire('¡Miembro creado!', `✅ El miembro ha sido creado`, 'success');
            setFormData({
                name: '',
                instrument: '',
                voice: false,
                file: undefined,
            });
            setPreviewUrl(null);
            setErrors([]);
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

                    <Form.Group className="mb-3" controlId="formInstrument">
                        <Form.Label>Instrumento</Form.Label>
                        <Form.Control
                            type="text"
                            name="instrument"
                            placeholder="Ej. Guitarra, Violín..."
                            value={formData.instrument}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formVoice">
                        <Form.Label>¿Tiene Voz?</Form.Label>
                        <Form.Select
                            name="voice"
                            value={formData.voice ? 'true' : 'false'}
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
                            name="file"
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

                    {errors.length > 0 && (
                        <div className="alert alert-danger">
                            <ul className="mb-0">
                                {errors.map((error, i) => (
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