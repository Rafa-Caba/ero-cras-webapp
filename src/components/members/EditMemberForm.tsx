// src/components-admin/members/EditMemberForm.tsx
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { useMemberStore } from '../../store/admin/useMemberStore';
import { useInstrumentsStore } from '../../store/admin/useInstrumentsStore';
import { InstrumentPickerModal } from '../components-admin/instruments/InstrumentPickerModal';
import type { Instrument } from '../../types/instrument';
import type { CreateMemberPayload } from '../../types/member';

export const EditMemberForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { getMember, editMember } = useMemberStore();
    const {
        instruments,
        loading: instrumentsLoading,
        fetchInstruments,
    } = useInstrumentsStore();

    const [formData, setFormData] = useState<CreateMemberPayload>({
        name: '',
        instrumentId: undefined,
        instrumentLabel: '',
        instrument: '',
        voice: false,
        file: undefined,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);
    const [selectedInstrumentId, setSelectedInstrumentId] = useState<string | null>(null);

    useEffect(() => {
        const loadMember = async () => {
            if (!id) return;

            try {
                const member = await getMember(id);

                if (member) {
                    // Member type might not yet have instrumentId/instrumentLabel,
                    // so we stay safe and derive from member.instrument.
                    const baseInstrument =
                        (member as any).instrumentLabel ||
                        member.instrument ||
                        '';

                    setFormData({
                        name: member.name,
                        instrumentId: (member as any).instrumentId || undefined,
                        instrumentLabel: baseInstrument,
                        instrument: baseInstrument,
                        voice: member.voice,
                        file: undefined,
                    });

                    setSelectedInstrumentId((member as any).instrumentId || null);
                    setPreviewUrl(member.imageUrl || null);
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error', 'No se pudo obtener el miembro', 'error');
                setTimeout(() => navigate('/admin/members'), 1500);
            }
        };

        loadMember();
    }, [id, getMember, navigate]);

    useEffect(() => {
        if (!instruments || instruments.length === 0) {
            fetchInstruments().catch((err) => {
                console.error('Error fetching instruments:', err);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;

        if (target.type === 'file') {
            const file = target.files?.[0];
            if (file) {
                setFormData(prev => ({ ...prev, file }));
                setPreviewUrl(URL.createObjectURL(file));
            }
        } else if (target.name === 'voice') {
            setFormData(prev => ({ ...prev, voice: target.value === 'true' }));
        } else if (target.name === 'instrument') {
            const value = target.value;
            setFormData(prev => ({
                ...prev,
                instrument: value,
                instrumentLabel: value,
                instrumentId: undefined,
            }));
        } else {
            const { name, value } = target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleOpenInstrumentPicker = () => {
        setShowInstrumentPicker(true);
    };

    const handleCloseInstrumentPicker = () => {
        setShowInstrumentPicker(false);
    };

    const handleInstrumentSelected = (instrument: Instrument | null) => {
        if (!instrument) {
            setSelectedInstrumentId(null);
            setFormData(prev => ({
                ...prev,
                instrumentId: undefined,
                instrumentLabel: '',
                instrument: '',
            }));
            return;
        }

        setSelectedInstrumentId(instrument.id);
        setFormData(prev => ({
            ...prev,
            instrumentId: instrument.id,
            instrumentLabel: instrument.name,
            instrument: instrument.name,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        try {
            await editMember(id, formData);
            Swal.fire('Actualizado', '✅ Miembro actualizado exitosamente', 'success');
            navigate('/admin/members');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo actualizar el miembro', 'error');
        }
    };

    const selectedInstrumentLabel =
        formData.instrumentLabel && formData.instrumentLabel.trim().length > 0
            ? formData.instrumentLabel
            : 'Ningún instrumento seleccionado';

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

                {/* Instrument picker + manual input */}
                <Form.Group className="mb-3" controlId="formInstrument">
                    <Form.Label>Instrumento</Form.Label>
                    <div className="d-flex flex-column flex-md-row align-items-md-center gap-2">
                        <Form.Control
                            type="text"
                            name="instrument"
                            placeholder="Selecciona un instrumento o escribe uno"
                            value={formData.instrument}
                            onChange={handleChange}
                            required
                        />
                        <Button
                            type="button"
                            className="btn-outline-primary-theme-color"
                            onClick={handleOpenInstrumentPicker}
                            disabled={instrumentsLoading}
                        >
                            {instrumentsLoading ? 'Cargando...' : 'Elegir'}
                        </Button>
                    </div>
                    <small className="text-muted">
                        Seleccionado: <strong>{selectedInstrumentLabel}</strong>
                    </small>
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
                        <Image
                            src={previewUrl}
                            roundedCircle
                            height={150}
                            width={150}
                            alt="Vista previa"
                        />
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

                <div className="text-center">
                    <Button type="submit" className="general_btn">
                        Actualizar Miembro
                    </Button>
                    <Link to="/admin/members" className="btn btn-secondary ms-2">
                        Regresar a Miembros
                    </Link>
                </div>
            </Form>

            <InstrumentPickerModal
                show={showInstrumentPicker}
                onClose={handleCloseInstrumentPicker}
                instruments={instruments || []}
                selectedInstrumentId={selectedInstrumentId}
                onSelectInstrument={handleInstrumentSelected}
            />
        </Container>
    );
};
