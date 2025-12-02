import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Button, Spinner } from "react-bootstrap";
import { useGalleryStore } from "../../store/admin/useGalleryStore";
import { useAuth } from "../../context/AuthContext";

export const AdminGallery = () => {
    const [searchParams] = useSearchParams();
    const [loadingLocal, setLoadingLocal] = useState(true);
    const { canEdit } = useAuth();

    const {
        images,
        fetchGallery,
        updateFlags,
        loading
    } = useGalleryStore();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                await fetchGallery();
            } catch (error) {
                Swal.fire("Error", "No se pudieron cargar las imágenes", "error");
            } finally {
                setLoadingLocal(false);
            }
        };

        fetchImages();
    }, [searchParams]);

    const showFlagOptions = async (imageId: string, alreadyInGallery: boolean) => {
        const fields = [
            { key: 'imageStart', label: 'Imagen de Inicio' },
            { key: 'imageLeftMenu', label: 'Menú Izquierdo' },
            { key: 'imageRightMenu', label: 'Menú Derecho' },
            { key: 'imageUs', label: 'Sección Nosotros' },
            { key: 'imageLogo', label: 'Logo' },
            { key: 'imageGallery', label: alreadyInGallery ? 'Quitar de Galería' : 'Agregar a Galería' }
        ];

        const formHtml = fields.map(c =>
            `<div>
            <input type="checkbox" id="${c.key}" name="field" value="${c.key}"/>
            <label for="${c.key}">${c.label}</label>
        </div>`
        ).join('');

        const { value: selected, isConfirmed } = await Swal.fire({
            title: 'Selecciona los campos',
            html: formHtml,
            focusConfirm: false,
            preConfirm: () => {
                const inputs = document.querySelectorAll<HTMLInputElement>('input[name="field"]:checked');
                const selected = Array.from(inputs).map(input => input.value);

                if (selected.length === 0) {
                    Swal.showValidationMessage('Selecciona al menos una opción');
                }

                return selected;
            },
            confirmButtonText: 'Guardar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
        });

        if (!isConfirmed || !selected) return;

        try {
            const flagsUpdate: Record<string, boolean> = {};

            selected.forEach((key: string) => {
                if (key === 'imageGallery') {
                    flagsUpdate[key] = !alreadyInGallery;
                } else {
                    flagsUpdate[key] = true;
                }
            });

            await updateFlags(imageId, flagsUpdate);
            await fetchGallery();

            Swal.fire('Actualizado', 'Los campos fueron marcados correctamente', 'success');
        } catch (err) {
            Swal.fire('Error', 'No se pudo actualizar la imagen', 'error');
        }
    };

    return (
        <div>
            <div className="primary-color-container d-flex flex-column align-items-center w-100 my-3">
                <h2 className="mt-3">Galeria Ero Cras</h2>
                <div className="botones mb-3">
                    {/* <Link to="/admin" className="btn general_btn me-2">Inicio</Link> */}
                    {canEdit && <Link to="/admin/gallery/new" className="btn general_btn">Nueva Imagen</Link>}
                </div>
            </div>

            {
                !loadingLocal && !loading
                    ? (
                        <div className="primary-color-container w-100 mt-3 d-flex flex-wrap justify-content-center mb-0">
                            <div className="container my-4 d-flex flex-fill flex-column flex-md-row flex-wrap align-items-center justify-content-around">
                                {images.map((image) => (
                                    <div key={image.id} className="col-md-3 d-flex flex-column align-items-center m-2 mb-3">
                                        <Link to={`/admin/gallery/media/${image.id}`}>
                                            <img
                                                className="galeria-img mb-1"
                                                src={image.imageUrl}
                                                alt={image.title}
                                            />
                                        </Link>

                                        {canEdit && (
                                            <>
                                                <p className="fw-bolder mb-0">{image.title}</p>
                                                <div className="text-center">
                                                    <Button
                                                        className="btn destacar_btn"
                                                        onClick={() => showFlagOptions(image.id!, !!image.imageGallery)}
                                                    >
                                                        Opciones de Imagen
                                                    </Button>

                                                    <div className="mt-2">
                                                        {image.imageStart && <span className="badge bg-primary me-1">Inicio</span>}
                                                        {image.imageLeftMenu && <span className="badge bg-secondary me-1">Menú Izq</span>}
                                                        {image.imageRightMenu && <span className="badge bg-info text-dark me-1">Menú Der</span>}
                                                        {image.imageUs && <span className="badge bg-warning text-dark me-1">Nosotros</span>}
                                                        {image.imageLogo && <span className="badge bg-success me-1">Logo</span>}
                                                        {image.imageGallery && <span className="badge bg-dark text-light me-1">Galería</span>}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                    ) : (
                        <div className="d-flex justify-content-center my-5">
                            <Spinner animation="border" role="status" />
                        </div>
                    )
            }
        </div>
    );
};