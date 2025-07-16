import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import type { JSONContent } from '@tiptap/react';
import { crearCanto } from "../../services/cantos";
import { TiptapEditor } from "../tiptap-components/TiptapEditor";
import { parseTexto } from "../../utils/handleTextTipTap";

export const AdminNewSong = () => {
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState<JSONContent | null>(null);
    const [tipo, setTipo] = useState("");
    const [compositor, setCompositor] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!titulo || !texto || !tipo || !compositor) {
            Swal.fire("Campos requeridos", "Llena todos los campos", "warning");
            return;
        }

        try {
            await crearCanto({ titulo, texto, tipo, compositor });

            Swal.fire("¡Éxito!", "Canto guardado correctamente", "success");

            setTitulo("");
            setTexto(null);
            setTipo("");
            setCompositor("");

            navigate("/admin/cantos");
        } catch (err) {
            Swal.fire("Error", "Ocurrió un error inesperado", "error");
        }
    };

    return (
        <article className="m-3 col-md-8 mx-auto">
            <div className="form-canto">
                <h2 className="titulo mb-4">Nuevo Canto</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="titulo">
                        <Form.Label>Título del Canto</Form.Label>
                        <Form.Control
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            placeholder="Título del canto"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Texto del Canto</Form.Label>
                        <TiptapEditor content={parseTexto(texto)} onChange={(val: JSONContent) => setTexto(val)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="tipo">
                        <Form.Label>Tipo de Canto</Form.Label>
                        <Form.Control
                            type="text"
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            placeholder="Tipo de canto"
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="compositor">
                        <Form.Label>Compositor</Form.Label>
                        <Form.Control
                            type="text"
                            value={compositor}
                            onChange={(e) => setCompositor(e.target.value)}
                            placeholder="Compositor"
                        />
                    </Form.Group>

                    <div className='text-center'>
                        <Button type="submit" className="general_btn me-2" variant="">Guardar Canto</Button>
                        <Button variant="secondary" onClick={() => navigate("/admin/cantos")}>Cancelar</Button>
                    </div>
                </Form>
            </div>
        </article>
    );
};
