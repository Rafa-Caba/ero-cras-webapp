import { Button } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { eliminarCanto, obtenerCantoPorId } from "../../services/cantos";
import type { Canto } from "../../types";
import { useEffect, useState } from "react";
import { TiptapViewer } from "../tiptap-components/TiptapViewer";
import { parseTexto } from "../../utils/handleTextTipTap";

export const AdminSingleCanto = () => {
    const { id } = useParams<string>();
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

    if (!canto) {
        return <p>No se encontró el canto.</p>;
    }

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción no se puede deshacer!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, borrar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed && canto?._id) {
            try {
                await eliminarCanto(canto._id);
                Swal.fire("¡Borrado!", "El canto ha sido eliminado.", "success");

                navigate("/admin/cantos");
            } catch (err) {
                Swal.fire("Error", "No se pudo eliminar el canto", "error");
            }
        }
    };

    return (
        <div className="canto p-3 w-100 text-center my-3">
            <div>
                <h2 className="titulo">{canto.titulo}</h2>
                <p className="fst-italic">{canto.tipo}</p>

                <div className=".texto-scrollable">
                    <p className="d-md-block text-center mb-3 fs-4 texto-scrollable">
                        <TiptapViewer content={parseTexto(canto.texto)} />
                    </p>
                </div>

                <p className="fst-italic mb-4 fw-bold">{canto.compositor}</p>

                <div className="m-0">
                    <Link to={`/admin/cantos/edit/${canto._id}`} className="btn general_btn me-2">
                        Editar
                    </Link>
                    <Link to="/admin/cantos" className="btn general_btn me-2">
                        Volver
                    </Link>
                    <Button variant="danger" onClick={handleDelete}>
                        Borrar
                    </Button>
                </div>
            </div>
        </div>
    );
};
