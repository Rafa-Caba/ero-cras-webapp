
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { eliminarCanto, obtenerCantoPorId } from "../../services/cantos";
import type { Canto } from "../../types";
import { useEffect, useState } from "react";

interface Props {
    cantoId: string;
}

const AdminSingleCanto = ({ cantoId }: Props) => {
    const navigate = useNavigate();
    const [canto, setCanto] = useState<Canto | null>(null);

    useEffect(() => {
        const cargarCanto = async () => {
            try {
                if (cantoId) {
                    const data = await obtenerCantoPorId(cantoId);
                    setCanto(data);
                }
            } catch (error) {
                console.error('Error al obtener el canto:', error);
            }
        };

        cargarCanto();
    }, [cantoId]);

    console.log(canto);

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

    console.log({
        ...canto
    });

    return (
        <div className="canto p-3 w-100 text-center my-3">
            <div>
                <h2 className="titulo">{canto.titulo}</h2>
                <p className="fst-italic">{canto.tipo}</p>

                <div className=".texto-scrollable">
                    {/* Responsive canto texto */}
                    <p className="d-block d-md-none text-start mb-3 lh-base fs-6 texto-scrollable">
                        {canto.texto.split("\n").map((line, i) => (
                            <span key={i}>{line}<br /></span>
                        ))}
                    </p>
                    <p className="d-none d-md-block text-center mb-3 fs-4 texto-scrollable">
                        {canto.texto.split("\n").map((line, i) => (
                            <span key={i}>{line}<br /></span>
                        ))}
                    </p>

                </div>

                <p className="fst-italic mb-4 fw-bold">{canto.compositor}</p>

                <div className="m-0">
                    <Link to={`/admin/edit_canto/${canto._id}`} className="btn general_btn me-2">
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

export default AdminSingleCanto;
