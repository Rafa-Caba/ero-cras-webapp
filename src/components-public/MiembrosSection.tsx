import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { usePublicMiembrosStore } from "../store/public/usePublicMiembrosStore";

const MiembrosSection = () => {

    const { miembros, cargando, fetchMiembrosPublicos } = usePublicMiembrosStore();

    useEffect(() => {
        (async () => {
            await fetchMiembrosPublicos();
        })();
    }, []);

    if (cargando) return <Spinner />;

    return (
        <div className="miembros w-100">
            <p className="text-center mb-1 fw-bolder fs-2">Integrantes</p>
            <div className="tarjetas w-100 d-flex flex-row flex-wrap justify-content-center">
                {miembros?.length > 0
                    ? miembros.map((miembro) => (
                        <div className="contenedor_tarjeta" key={miembro._id}>
                            <figure className="position-relative m-0">
                                <img className="frontal d-block" src={miembro.fotoPerfilUrl} alt={miembro.nombre} />
                                <figcaption className="trasera">
                                    <h2 className="titulo fs-3">{miembro.nombre}</h2>
                                    <hr />
                                    <p className="fs-4 lh-sm">{miembro.instrumento}</p>
                                </figcaption>
                            </figure>
                            <p className="text-center fw-bolder">{miembro.nombre}</p>
                        </div>
                    ))
                    : <p>No hay miembros por mostrar.</p>}
            </div>
        </div>
    );
};

export default MiembrosSection;
