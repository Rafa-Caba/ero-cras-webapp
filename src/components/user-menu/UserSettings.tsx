import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Container, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

import { useUsersStore } from '../../store/admin/useUsersStore';
import { useAuth } from '../../context/AuthContext';

import { useInstrumentsStore } from '../../store/admin/useInstrumentsStore';
import { InstrumentPickerModal } from '../components-admin/instruments/InstrumentPickerModal';
import type { Instrument } from '../../types/instrument';

export const UserSettings = () => {
    const { user, updateUser } = useAuth();
    const { updateMyProfile } = useUsersStore();

    const {
        instruments,
        loading: instrumentsLoading,
        fetchInstruments,
    } = useInstrumentsStore();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        imageUrl: '',
        instrumentId: '',
        instrumentLabel: '',
    });

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [showInstrumentPicker, setShowInstrumentPicker] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
                email: user.email || '',
                imageUrl: user.imageUrl || '',
                instrumentId: (user as any).instrumentId || '',
                instrumentLabel: (user as any).instrumentLabel || '',
            });
            setPreviewUrl(user.imageUrl || null);
        }
    }, [user]);

    // Load instruments for picker
    useEffect(() => {
        if (!instruments || instruments.length === 0) {
            fetchInstruments().catch((err) =>
                console.error('Error fetching instruments for UserSettings:', err)
            );
        }
    }, [fetchInstruments, instruments]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;

        if (target.type === 'file') {
            const selectedFile = target.files?.[0];
            if (selectedFile) {
                setFile(selectedFile);
                setPreviewUrl(URL.createObjectURL(selectedFile));
            }
        } else {
            const { name, value } = target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleOpenInstrumentPicker = () => {
        setShowInstrumentPicker(true);
    };

    const handleInstrumentSelected = (instrument: Instrument | null) => {
        if (!instrument) {
            setFormData(prev => ({
                ...prev,
                instrumentId: '',
                instrumentLabel: '',
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            instrumentId: instrument.id,
            instrumentLabel: instrument.name,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!user?.id) return;

        const payload = new FormData();
        payload.append('name', formData.name);
        payload.append('username', formData.username);
        payload.append('email', formData.email);

        if (formData.instrumentId) {
            payload.append('instrumentId', formData.instrumentId);
        }
        if (formData.instrumentLabel) {
            payload.append('instrumentLabel', formData.instrumentLabel);
        }

        if (file) {
            payload.append('file', file);
        }

        try {
            const updatedUser = await updateMyProfile(payload);

            updateUser(updatedUser);

            Swal.fire('Actualizado', '✅ Datos actualizados con éxito', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', '❌ No se pudo actualizar el usuario', 'error');
        }
    };

    return (
        <Container className="m-3 col-md-8 mt-4 mx-auto">
            <h3>Ajustes del Usuario</h3>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
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
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Instrumento</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="text"
                            name="instrumentLabel"
                            placeholder="Selecciona un instrumento..."
                            value={formData.instrumentLabel}
                            readOnly
                        />
                        <Button
                            className="btn-outline-primary-theme-color"
                            type="button"
                            onClick={handleOpenInstrumentPicker}
                            disabled={instrumentsLoading}
                        >
                            {instrumentsLoading ? 'Cargando...' : 'Elegir'}
                        </Button>
                    </div>
                    {formData.instrumentId && (
                        <Form.Text muted>
                            Instrumento seleccionado: {formData.instrumentLabel}
                        </Form.Text>
                    )}
                </Form.Group>

                {previewUrl && (
                    <div className="mb-3 mt-4 text-center">
                        <Image
                            src={previewUrl}
                            roundedCircle
                            width={200}
                            height={200}
                            alt="Vista previa"
                        />
                    </div>
                )}

                <Form.Group className="mb-3">
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
                        Guardar cambios
                    </Button>
                    <Link to="/admin" style={{ borderRadius: 10 }} className="btn btn-secondary px-3 py-1 ms-2 mt-2 mt-md-0">
                        Ir al Inicio
                    </Link>
                </div>
            </Form>

            <InstrumentPickerModal
                show={showInstrumentPicker}
                onClose={() => setShowInstrumentPicker(false)}
                instruments={instruments}
                selectedInstrumentId={formData.instrumentId || null}
                onSelectInstrument={handleInstrumentSelected}
            />
        </Container>
    );
};
