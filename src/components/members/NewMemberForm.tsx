// src/components-admin/members/NewMemberForm.tsx
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

import type { CreateMemberPayload } from '../../types/member';
import { useMemberStore } from '../../store/admin/useMemberStore';
import { useInstrumentsStore } from '../../store/admin/useInstrumentsStore';
import { InstrumentPickerModal } from '../components-admin/instruments/InstrumentPickerModal';
import type { Instrument } from '../../types/instrument';

export const NewMemberForm = () => {
    const navigate = useNavigate();
    const { addMember } = useMemberStore();

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
    const [errors, setErrors] = useState<string[]>([]);

    const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);
    const [selectedInstrumentId, setSelectedInstrumentId] = useState<string | null>(null);

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
        const { name, value, files } = target;

        if (name === 'file' && files && files[0]) {
            const file = files[0];
            setFormData(prev => ({ ...prev, file }));
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        } else if (name === 'voice') {
            setFormData(prev => ({ ...prev, voice: value === 'true' }));
        } else if (name === 'instrument') {
            // Keep instrument and instrumentLabel in sync when typing manually
            setFormData(prev => ({
                ...prev,
                instrument: value,
                instrumentLabel: value,
                // manual typing clears catalog id
                instrumentId: undefined,
            }));
        } else {
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
            // Clear selection
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
            // still keep the plain string for compatibility
            instrument: instrument.name,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors: string[] = [];

        if (!formData.name.trim()) newErrors.push('El nombre es requerido.');
        if (!formData.instrumentLabel.trim()) newErrors.push('El instrumento es requerido.');

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await addMember(formData);

            Swal.fire('¡Miembro creado!', '✅ El miembro ha sido creado', 'success');
            setFormData({
                name: '',
                instrumentId: undefined,
                instrumentLabel: '',
                instrument: '',
                voice: false,
                file: undefined,
            });
            setPreviewUrl(null);
            setErrors([]);
            navigate('/admin/members');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const selectedInstrumentLabel =
        formData.instrumentLabel && formData.instrumentLabel.trim().length > 0
            ? formData.instrumentLabel
            : 'Ningún instrumento seleccionado';

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

                    <div className="text-center">
                        <Button type="submit" className="general_btn">
                            Crear miembro
                        </Button>
                        <Button
                            className="ms-2"
                            variant="secondary"
                            type="button"
                            onClick={() => navigate('/admin/members')}
                        >
                            Cancelar
                        </Button>
                    </div>
                </Form>

                {/* Instrument Picker Modal */}
                <InstrumentPickerModal
                    show={showInstrumentPicker}
                    onClose={handleCloseInstrumentPicker}
                    instruments={instruments || []}
                    selectedInstrumentId={selectedInstrumentId}
                    onSelectInstrument={handleInstrumentSelected}
                />
            </div>
        </article>
    );
};
