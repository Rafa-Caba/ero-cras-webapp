import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { actualizarCanto, obtenerCantoPorId } from '../../services/cantos';
import Swal from 'sweetalert2';
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
        <section className="center col-12 col-md-8 d-flex flex-column align-items-center order-0 order-md-1">
            <article className="p-4 container col-md-8">
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
                            <Form.Label >Letra del Canto</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={7}
                                name="canto_texto"
                                value={canto.texto}
                                onChange={handleChange}
                                placeholder="Texto del canto"
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

                        <Button type="submit" className="btn general_btn me-2">Modificar Canto</Button>
                        <Button variant="secondary" onClick={() => navigate(`/admin/canto/${canto._id}`)}>Volver</Button>
                    </Form>
                </div>
            </article>
        </section>
    );
};

export default AdminEditCanto;
