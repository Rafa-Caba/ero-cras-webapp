import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { actualizarCanto, obtenerCantoPorId } from '../../services/cantos';
import Swal from 'sweetalert2';
import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { createHandleTextoChange } from '../../utils/handleTextTipTap';
import type { Canto } from '../../types';

const AdminEditCanto = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [canto, setCanto] = useState<Canto | null>(null);

    useEffect(() => {
        const cargarCanto = async () => {
            try {
                if (id) {
                    const data = await obtenerCantoPorId(id);
                    setCanto(data);
                }
            } catch (error) {
                console.error('Error al obtener el canto:', error);
            }
        };

        cargarCanto();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCanto(prev => prev ? { ...prev, [name]: value } : prev);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!canto || !canto._id) return;

        try {
            await actualizarCanto(canto._id, canto);
            Swal.fire("Guardado", "El canto ha sido actualizado", "success");
            navigate(`/admin/canto/${canto._id}`);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudo actualizar el canto", "error");
        }
    };

    if (!canto) return <p>Cargando canto...</p>;

    return (
        <article className="m-3 col-md-8 mx-auto">
            <div className="form-canto">
                <h2 className="titulo">Editar Canto</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Control type="hidden" name="id" value={canto._id} readOnly />

                    <Form.Group className="my-3">
                        <Form.Label >Titulo</Form.Label>
                        <Form.Control
                            type="text"
                            name="titulo"
                            value={canto.titulo}
                            onChange={handleChange}
                            placeholder="Título"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Texto del Canto</Form.Label>
                        <TiptapEditor
                            content={canto.texto}
                            onChange={createHandleTextoChange(setCanto, 'texto')}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label >Tipo de Canto</Form.Label>
                        <Form.Control
                            type="text"
                            name="tipo_de_canto"
                            value={canto.tipo}
                            onChange={handleChange}
                            placeholder="Tipo de canto"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label >Compositor</Form.Label>
                        <Form.Control
                            type="text"
                            name="compositor"
                            value={canto.compositor}
                            onChange={handleChange}
                            placeholder="Compositor"
                        />
                    </Form.Group>

                    <div className='text-center'>
                        <Button type="submit" className="btn general_btn me-2">Modificar Canto</Button>
                        <Button variant="secondary" onClick={() => navigate(`/admin/canto/${canto._id}`)}>Volver</Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};

export default AdminEditCanto;
