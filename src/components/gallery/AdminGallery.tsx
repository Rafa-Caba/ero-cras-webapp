import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Spinner } from "react-bootstrap";
import { useGaleriaStore } from "../../store/useGaleriaStore";

export const AdminGallery = () => {
    const [searchParams] = useSearchParams();
    const [cargando, setCargando] = useState(true);

    const { imagenes, fetchImagenes, marcarCampo, totalPaginas, paginaActual, toggleGaleria } = useGaleriaStore();

    useEffect(() => {
        const pageFromURL = parseInt(searchParams.get('p') || '1');

        const obtenerImagenes = async () => {
            try {
                fetchImagenes(pageFromURL);
            } catch (error) {
                Swal.fire("Error", "No se pudieron cargar las imágenes", "error");
            } finally {
                setCargando(false);
            }
        };

        obtenerImagenes();
    }, [searchParams]);

    const mostrarOpcionesDeMarcado = async (imagenId: string, yaEnGaleria: boolean) => {
        const campos = [
            { clave: 'imagenInicio', label: 'Imagen de Inicio' },
            { clave: 'imagenLeftMenu', label: 'Menú Izquierdo' },
            { clave: 'imagenRightMenu', label: 'Menú Derecho' },
            { clave: 'imagenNosotros', label: 'Sección Nosotros' },
            { clave: 'imagenLogo', label: 'Logo' },
            { clave: 'imagenGaleria', label: yaEnGaleria ? 'Quitar de Galería' : 'Agregar a Galería' } // 🟣 Nueva opción
        ];

        const formHtml = campos.map(c =>
            `<div>
            <input type="checkbox" id="${c.clave}" name="campo" value="${c.clave}"/>
            <label for="${c.clave}">${c.label}</label>
        </div>`
        ).join('');

        const { value: seleccionados, isConfirmed } = await Swal.fire({
            title: 'Selecciona los campos',
            html: formHtml,
            focusConfirm: false,
            preConfirm: () => {
                const inputs = document.querySelectorAll<HTMLInputElement>('input[name="campo"]:checked');
                const seleccionados = Array.from(inputs).map(input => input.value);

                if (seleccionados.length === 0) {
                    Swal.showValidationMessage('Selecciona al menos una opción');
                }

                return seleccionados;
            },
            confirmButtonText: 'Guardar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        });

        if (!isConfirmed || !seleccionados) return;

        try {
            for (const campo of seleccionados) {
                if (campo === 'imagenGaleria') {
                    await toggleGaleria(imagenId, !yaEnGaleria);
                } else {
                    await marcarCampo(imagenId, campo as any);
                }
            }

            await fetchImagenes(paginaActual);
            Swal.fire('Actualizado', 'Los campos fueron marcados correctamente', 'success');
        } catch (err) {
            Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
        }
    };


    return (
        <div>
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
                                    <div key={imagen._id} className="col-3 d-flex flex-column align-items-center m-2 mb-3">
                                        <Link to={`/admin/photo/${imagen._id}`}>
                                            <img
                                                className="galeria-img mb-1"
                                                src={imagen.imagenUrl}
                                                alt={imagen.titulo}
                                            />
                                        </Link>

                                        <p className="fw-bolder mb-0">{imagen.titulo}</p>
                                        <div className="text-center">
                                            <Button
                                                className="btn destacar_btn"
                                                onClick={() => mostrarOpcionesDeMarcado(imagen._id!, !!imagen.imagenGaleria)}
                                            >
                                                Opciones de Imagen
                                            </Button>

                                            <div className="mt-2">
                                                {imagen.imagenInicio && <span className="badge bg-primary me-1">Inicio</span>}
                                                {imagen.imagenLeftMenu && <span className="badge bg-secondary me-1">Menú Izq</span>}
                                                {imagen.imagenRightMenu && <span className="badge bg-info text-dark me-1">Menú Der</span>}
                                                {imagen.imagenNosotros && <span className="badge bg-warning text-dark me-1">Nosotros</span>}
                                                {imagen.imagenLogo && <span className="badge bg-success me-1">Logo</span>}
                                                {imagen.imagenGaleria && <span className="badge bg-dark text-light me-1">Galería</span>}
                                            </div>
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
    );
};
