import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { Button, Form, Spinner, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { useAdminSettingsStore } from '../../store/admin/useSettingsStore';
import type { UpdateSettingsPayload } from '../../types/settings';

import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { createHandleTextoChange, parseText } from '../../utils/handleTextTipTap';
import { emptyEditorContent } from '../../utils/editorDefaults';

export const AdminSettings = () => {
    const { settings, loading, fetchSettings, updateSettings } = useAdminSettingsStore();

    const [formData, setFormData] = useState<UpdateSettingsPayload | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const setFormDataSafe: React.Dispatch<React.SetStateAction<UpdateSettingsPayload | null>> = setFormData;

    const updateFormData = (updater: (prev: UpdateSettingsPayload) => UpdateSettingsPayload) => {
        setFormData(prev => (prev ? updater(prev) : prev));
    };

    const defaultFormData: UpdateSettingsPayload = {
        webTitle: '',
        contactPhone: '',
        socials: { facebook: '', instagram: '', youtube: '', whatsapp: '', email: '' },
        homeLegends: { principal: '', secondary: '' },
        history: emptyEditorContent,
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings) {
            setFormData({
                webTitle: settings.webTitle || '',
                contactPhone: settings.contactPhone || '',
                socials: { ...defaultFormData.socials, ...settings.socials },
                homeLegends: { ...defaultFormData.homeLegends, ...settings.homeLegends },
                history: (parseText(settings.history) as any) || emptyEditorContent,
            });
            setPreviewUrl(settings.logoUrl || null);
        } else {
            setFormData(defaultFormData);
        }
    }, [settings]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (!formData) return;

        updateFormData(prev => {
            if (keys.length === 1) return { ...prev, [name]: value };

            const [parentKey, childKey] = keys as [keyof UpdateSettingsPayload, string];
            const parentObject = (prev[parentKey] || {}) as Record<string, any>;

            return { ...prev, [parentKey]: { ...parentObject, [childKey]: value } };
        });
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            const submissionData = new FormData();

            submissionData.append('data', JSON.stringify(formData));

            if (logoFile) {
                submissionData.append('file', logoFile);
            }

            await updateSettings(submissionData);

            Swal.fire({
                icon: 'success',
                title: '¡Configuración actualizada!',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo actualizar la configuración.', 'error');
        }
    };

    if (loading && !formData) {
        return <div className="d-flex justify-content-center my-5"><Spinner animation="border" /></div>;
    }

    return (
        <div className="container py-4">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Configuración General</h2>
                <div className="botones mb-3">
                    {/* <Link to="/admin" className="btn general_btn px-3 m-2">Ir al Inicio</Link> */}
                </div>
            </div>

            <Form onSubmit={handleSubmit}>
                {/* General Info */}
                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Título de la página</Form.Label>
                            <Form.Control name="webTitle" value={formData?.webTitle} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono de contacto</Form.Label>
                            <Form.Control name="contactPhone" value={formData?.contactPhone} onChange={handleChange} />
                        </Form.Group>
                    </div>
                    <div className="col-md-6 text-center">
                        <Form.Group className="mb-3">
                            <Form.Label>Logo del Sitio</Form.Label>
                            <div className="mb-2">
                                {previewUrl ? (
                                    <Image src={previewUrl} thumbnail style={{ maxHeight: '100px' }} />
                                ) : (
                                    <div className="text-muted small border p-3 rounded">Sin Logo</div>
                                )}
                            </div>
                            <Form.Control type="file" accept="image/*" onChange={handleFileChange} size="sm" />
                        </Form.Group>
                    </div>
                </div>

                <Form.Group className="mb-3">
                    <Form.Label>Título principal de inicio</Form.Label>
                    <Form.Control name="homeLegends.principal" value={formData?.homeLegends?.principal} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Leyenda secundaria de inicio</Form.Label>
                    <Form.Control name="homeLegends.secondary" value={formData?.homeLegends?.secondary} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Historia / Nosotros</Form.Label>
                    <TiptapEditor
                        content={parseText(formData?.history)}
                        onChange={createHandleTextoChange<UpdateSettingsPayload>(setFormDataSafe, 'history')}
                    />
                </Form.Group>

                <hr />
                <h5 className="mt-4">Redes Sociales</h5>
                <div className="row">
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>Facebook</Form.Label>
                            <Form.Control name="socials.facebook" value={formData?.socials?.facebook} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Instagram</Form.Label>
                            <Form.Control name="socials.instagram" value={formData?.socials?.instagram} onChange={handleChange} />
                        </Form.Group>
                    </div>
                    <div className="col-md-6">
                        <Form.Group className="mb-3">
                            <Form.Label>YouTube</Form.Label>
                            <Form.Control name="socials.youtube" value={formData?.socials?.youtube} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>WhatsApp</Form.Label>
                            <Form.Control name="socials.whatsapp" value={formData?.socials?.whatsapp} onChange={handleChange} />
                        </Form.Group>
                    </div>
                </div>

                <Form.Group className="mb-4">
                    <Form.Label>Correo (Email)</Form.Label>
                    <Form.Control name="socials.email" value={formData?.socials?.email} onChange={handleChange} />
                </Form.Group>

                <div className="text-center">
                    <Button type="submit" className="general_btn" disabled={loading}>
                        {loading ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                </div>
            </Form>
        </div>
    );
};