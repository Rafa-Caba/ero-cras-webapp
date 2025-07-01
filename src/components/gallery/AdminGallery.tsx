import { Link, useSearchParams } from "react-router-dom";
// import type { ImagenGaleria } from "../../types";
import { useEffect, useState } from "react";
// import { obtenerImagenes } from '../../services/gallery';
import Swal from "sweetalert2";
import { Button, Spinner } from "react-bootstrap";
import { useGaleriaStore } from "../../store/useGaleriaStore";


export const AdminGallery = () => {
    const [searchParams] = useSearchParams();
    // const [imagenes, setImagenes] = useState<ImagenGaleria[]>([]);
    // const [paginaActual, setPaginaActual] = useState(1);
    // const [totalPaginas, setTotalPaginas] = useState(1);
    const [cargando, setCargando] = useState(true);

    const { imagenes, fetchImagenes, destacarImagen, totalPaginas, paginaActual } = useGaleriaStore();

    useEffect(() => {
        const pageFromURL = parseInt(searchParams.get('p') || '1');
        // setPaginaActual(pageFromURL);

        const obtenerImagenes = async () => {
            try {
                fetchImagenes(pageFromURL);
                // setImagenes(data.imagenes);
                // setTotalPaginas(totalPaginas);
            } catch (error) {
                Swal.fire("Error", "No se pudieron cargar las imágenes", "error");
            } finally {
                setCargando(false);
            }
        };

        obtenerImagenes();
    }, [searchParams]);

    return (
        <section className="col-12 col-md-8 d-flex flex-column align-items-center order-0 order-md-1 py-3 mb-0">
            <div style={{ minHeight: '76vh' }} className="galeria w-100 d-flex flex-column px-3 align-items-center">
                <div style={{ minHeight: '76vh' }}>
                    <div className="galeria d-flex flex-column align-items-center w-100 my-3">
                        <h2 className="mt-3">Galeria Ero Cras</h2>
                        <div className="botones mb-3">
                            <Link to="/admin" className="btn general_btn me-2">Inicio</Link>
                            <Link to="/admin/gallery/new_image" className="btn general_btn">Nueva Imagen</Link>
                        </div>
                    </div>

                    {
                        !cargando
                            ? (
                                <div style={{ minHeight: '54vh' }} className="galeria w-100 mt-3 d-flex flex-wrap justify-content-center mb-0">
                                    <div className="container d-flex flex-fill flex-column flex-md-row flex-wrap align-items-center justify-content-around">
                                        {imagenes.map((imagen) => (
                                            <div key={imagen._id} className="col-3 d-flex flex-column align-items-center m-2">
                                                <Link to={`/admin/photo/${imagen._id}`}>
                                                    <img
                                                        className="galeria-img img-fluid mb-1"
                                                        src={imagen.imagenUrl}
                                                        alt={imagen.titulo}
                                                    />
                                                </Link>

                                                <p className="fw-bolder mb-0">{imagen.titulo}</p>
                                                <div className="text-center">
                                                    {!imagen.destacada && (
                                                        <Button className="btn destacar_btn" onClick={() => destacarImagen(imagen._id!)}>
                                                            Pon Imagen de Inicio
                                                        </Button>
                                                    )}

                                                    {imagen.destacada && (
                                                        <span className="badge bg-success py-2 mx-3">Imagen de Inicio</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            ) : (
                                <Spinner animation="border" role="status" />
                            )
                    }

                    {/* Paginación */}
                    <div className="mt-4 mb-2 d-flex justify-content-center gap-3">
                        {paginaActual > 1 && (
                            <Link className="btn btn-outline-primary" to={`/admin/gallery?p=${paginaActual - 1}`}>
                                ← Página Anterior
                            </Link>
                        )}
                        <span className="align-self-center">Página {paginaActual} de {totalPaginas}</span>
                        {paginaActual < totalPaginas && (
                            <Link className="btn btn-outline-primary" to={`/admin/gallery?p=${paginaActual + 1}`}>
                                Página Siguiente →
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};
