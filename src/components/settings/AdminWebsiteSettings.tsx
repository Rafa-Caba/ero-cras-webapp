import { useEffect, useState, type FormEvent } from 'react';
import { useSettingsStore } from '../../store/admin/useSettingsStore';
import type { Setting } from '../../types';
import Swal from 'sweetalert2';
import { Button, Form, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { createHandleTextoChange } from '../../utils/handleTextTipTap';

export const AdminWebsiteSettings = () => {
    const navigate = useNavigate();

    const { settings, cargando, fetchSettings, actualizarSettingsExistente } = useSettingsStore();
    const [formData, setFormData] = useState<Setting | null>(null);
    const [errores, setErrores] = useState<string[]>([]);

    const setFormDataSafe: React.Dispatch<React.SetStateAction<Setting | null>> = setFormData;

    const updateFormData = (
        updater: (prev: Setting) => Setting
    ) => {
        setFormData((prev) => {
            if (!prev) return prev;
            return updater(prev);
        });
    };

    const defaultFormData: Setting = {
        _id: '',
        tituloWeb: '',
        socialLinks: {
            facebook: '',
            instagram: '',
            youtube: '',
            whatsapp: '',
            correo: ''
        },
        leyendasInicio: {
            principal: '',
            secundaria: ''
        },
        historiaNosotros: '',
        telefonoContacto: '',
        createdAt: '',
        updatedAt: ''
    };

    useEffect(() => {
        if (!formData) setFormData(defaultFormData);
    }, []);

    useEffect(() => {
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings) {
            setFormData({
                _id: settings._id,
                tituloWeb: settings.tituloWeb || '',
                socialLinks: {
                    facebook: settings.socialLinks?.facebook || '',
                    instagram: settings.socialLinks?.instagram || '',
                    youtube: settings.socialLinks?.youtube || '',
                    whatsapp: settings.socialLinks?.whatsapp || '',
                    correo: settings.socialLinks?.correo || ''
                },
                leyendasInicio: {
                    principal: settings.leyendasInicio?.principal || '',
                    secundaria: settings.leyendasInicio?.secundaria || ''
                },
                historiaNosotros: settings.historiaNosotros || '',
                telefonoContacto: settings.telefonoContacto || '',
                createdAt: settings.createdAt || '',
                updatedAt: settings.updatedAt || ''
            });
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');

        if (!formData) {
            setErrores(['Error interno: el formulario no está cargado.']);
            return;
        }

        updateFormData(prev => {
            if (keys.length === 1) {
                return { ...prev, [name]: value };
            }

            const [parentKey, childKey] = keys;
            const parent = prev[parentKey as keyof typeof prev] as Record<string, any>;

            return {
                ...prev,
                [parentKey]: {
                    ...parent,
                    [childKey]: value
                }
            };
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (!formData) {
                setErrores(['Error interno: el formulario no está cargado.']);
                return;
            }

            if (settings?._id) {
                await actualizarSettingsExistente(settings._id, formData);
                fetchSettings(); // refrescar los datos
                Swal.fire({
                    icon: 'success',
                    title: '¡Configuración actualizada!',
                    text: 'Los cambios se guardaron correctamente.',
                    timer: 1500,
                    showConfirmButton: false
                });

                setTimeout(() => {
                    navigate('/admin');
                }, 1500);
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo actualizar la configuración.', 'error');
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Configuración General</h2>
                <div className="botones mb-3">
                    <Link to="/admin" className="btn general_btn px-3 m-2">Ir al Inicio</Link>
                </div>
            </div>

            {cargando
                ? <div className="d-flex flex-column align-items-center my-5">
                    <Spinner />
                </div>
                : (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Título de la página</Form.Label>
                            <Form.Control name="tituloWeb" value={formData?.tituloWeb} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Título principal de inicio</Form.Label>
                            <Form.Control name="leyendasInicio.principal" value={formData?.leyendasInicio.principal} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Leyenda secundaria de inicio</Form.Label>
                            <Form.Control name="leyendasInicio.secundaria" value={formData?.leyendasInicio.secundaria} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Texto del Canto</Form.Label>
                            <TiptapEditor
                                content={formData?.historiaNosotros}
                                onChange={createHandleTextoChange<Setting>(setFormDataSafe, 'historiaNosotros')}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Telefono de contacto</Form.Label>
                            <Form.Control name="telefonoContacto" value={formData?.telefonoContacto} onChange={handleChange} />
                        </Form.Group>

                        <hr />
                        <h5 className="mt-4">Redes Sociales</h5>

                        <Form.Group className="mb-3">
                            <Form.Label>Facebook</Form.Label>
                            <Form.Control name="socialLinks.facebook" value={formData?.socialLinks.facebook} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Instagram</Form.Label>
                            <Form.Control name="socialLinks.instagram" value={formData?.socialLinks.instagram} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>YouTube</Form.Label>
                            <Form.Control name="socialLinks.youtube" value={formData?.socialLinks.youtube} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>WhatsApp</Form.Label>
                            <Form.Control name="socialLinks.whatsapp" value={formData?.socialLinks.whatsapp} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Correo</Form.Label>
                            <Form.Control name="socialLinks.correo" value={formData?.socialLinks.correo} onChange={handleChange} />
                        </Form.Group>

                        {errores.length > 0 && (
                            <div className="alert alert-danger">
                                <ul className="mb-0">
                                    {errores.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <Button type="submit" className="general_btn">Guardar cambios</Button>
                    </Form>
                )
            }
        </div>
    );
};
