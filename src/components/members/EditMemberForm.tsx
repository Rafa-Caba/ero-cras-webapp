import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useMemberStore } from '../../store/admin/useMemberStore';

interface EditFormState {
    name: string;
    instrument: string;
    voice: boolean;
    file: File | undefined;
}

export const EditMemberForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getMember, editMember } = useMemberStore();

    const [formData, setFormData] = useState<EditFormState>({
        name: '',
        instrument: '',
        voice: false,
        file: undefined
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const loadMember = async () => {
            if (!id) return;

            try {
                const member = await getMember(id);

                if (member) {
                    setFormData({
                        name: member.name,
                        instrument: member.instrument,
                        voice: member.voice,
                        file: undefined
                    });
                    setPreviewUrl(member.imageUrl || null);
                }
            } catch (error) {
                Swal.fire('Error', 'No se pudo obtener el miembro', 'error');
                setTimeout(() => navigate('/admin/members'), 1500);
            }
        };

        loadMember();
    }, [id]);

    // FIX: Added HTMLTextAreaElement to the type union
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        // Cast to HTMLInputElement to access specific properties like files
        const target = e.target as HTMLInputElement;

        if (target.type === 'file') {
            const file = target.files?.[0];
            if (file) {
                setFormData(prev => ({ ...prev, file: file }));
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else if (target.name === 'voice') {
            setFormData(prev => ({ ...prev, voice: target.value === 'true' }));
        } else {
            const { name, value } = target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        const payload = {
            name: formData.name,
            instrument: formData.instrument,
            voice: formData.voice,
            file: formData.file
        };

        try {
            await editMember(id, payload);
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
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
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
                        value={formData.instrument}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formVoice">
                    <Form.Label>¿Tiene voz?</Form.Label>
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

                {previewUrl && (
                    <div className="mb-3 text-center">
                        <Image src={previewUrl} roundedCircle height={150} width={150} alt="Vista previa" />
                    </div>
                )}

                <Form.Group className="mb-3" controlId="formFile">
                    <Form.Label>Foto de perfil (opcional)</Form.Label>
                    <Form.Control
                        type="file"
                        name="file"
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