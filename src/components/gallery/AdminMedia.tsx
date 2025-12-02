import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button, Spinner, Modal, CloseButton } from 'react-bootstrap';
import type { GalleryImage } from '../../types/gallery';
import { useGalleryStore } from '../../store/admin/useGalleryStore';
import { useAuth } from '../../context/AuthContext';

export const AdminMedia = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { canEdit } = useAuth();

    const { getImage, deleteImage, loading } = useGalleryStore();
    const [image, setImage] = useState<GalleryImage | null>(null);
    const [downloading, setDownloading] = useState(false);

    // 🆕 State for Full Screen Modal
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                if (id) {
                    const data = await getImage(id);
                    setImage(data);
                }
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, [id]);

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción no se puede deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed && id) {
            try {
                await deleteImage(id);
                await Swal.fire('Borrado', 'La imagen ha sido eliminada.', 'success');
                navigate('/admin/gallery');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar la imagen.', 'error');
            }
        }
    };

    const handleDownload = async () => {
        if (!image?.imageUrl) return;
        setDownloading(true);

        try {
            const response = await fetch(image.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            const ext = image.mediaType === 'VIDEO' ? 'mp4' : 'jpg';
            a.download = `${image.title.replace(/\s+/g, '_')}.${ext}`;

            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Download failed", error);
            window.open(image.imageUrl, '_blank');
        } finally {
            setDownloading(false);
        }
    };

    if (loading || !image) return <div className="d-flex justify-content-center mt-5"><Spinner animation="border" /></div>;

    return (
        <div className='m-3 container-fluid'>
            <div className="d-flex flex-column px-3 align-items-center w-100">

                {/* Header */}
                <div className="contenedor d-flex justify-content-center pt-3 mb-3">
                    <h2 className="titulo text-center">
                        {image.mediaType === 'VIDEO' ? '🎬 Video:' : '📷 Imagen:'} {image.title}
                    </h2>
                </div>

                <div className="contenedor w-100 d-flex flex-column align-items-center" style={{ minHeight: '65vh' }}>

                    {/* Media Display - Clickable */}
                    <div
                        className="mb-4 text-center w-100 position-relative"
                        style={{ maxWidth: '1000px', cursor: 'pointer' }}
                        onClick={() => setShowModal(true)}
                        title="Clic para ampliar"
                    >
                        {image.mediaType === 'VIDEO' ? (
                            <div className="position-relative">
                                <video
                                    className="rounded shadow-lg"
                                    src={image.imageUrl}
                                    controls={false}
                                    muted
                                    style={{
                                        width: '100%',
                                        maxHeight: '80vh',
                                        objectFit: 'contain',
                                        backgroundColor: '#000'
                                    }}
                                />
                                <div className="position-absolute top-50 start-50 translate-middle pointer-events-none">
                                    <span className="badge bg-dark bg-opacity-75 fs-5 rounded-pill px-4 py-2">▶ Ampliar</span>
                                </div>
                            </div>
                        ) : (
                            <img
                                className="img-fluid rounded shadow-lg"
                                src={image.imageUrl}
                                alt={image.title}
                                style={{
                                    width: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain'
                                }}
                            />
                        )}

                        {image.description && (
                            <div className="mt-3 p-3 bg-light rounded border text-start mx-auto" style={{ maxWidth: '800px', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                                <strong>Descripción: </strong> {image.description}
                            </div>
                        )}
                    </div>

                    <div className="imagen_options d-flex flex-wrap justify-content-center gap-3 mb-5">
                        <Button
                            className="btn general_btn"
                            onClick={handleDownload}
                            disabled={downloading}
                        >
                            {downloading ? 'Descargando...' : '📥 Descargar'}
                        </Button>

                        {canEdit && (
                            <>
                                <Link
                                    to={`/admin/gallery/edit/${image.id}`}
                                    className="btn general_btn"
                                >
                                    ✏️ Editar
                                </Link>
                                <Button
                                    variant="danger"
                                    onClick={handleDelete}
                                    style={{ borderRadius: 10 }}
                                >
                                    🗑️ Borrar
                                </Button>
                            </>
                        )}

                        <Link
                            className="btn btn-secondary"
                            to='/admin/gallery'
                        >
                            🔙 Regresar
                        </Link>
                    </div>
                </div>
            </div>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                size="xl"
                contentClassName="bg-dark border-0"
            >
                <Modal.Body className="p-0 position-relative d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', backgroundColor: 'black' }}>

                    {/* Close Button Overlay */}
                    <CloseButton
                        variant="white"
                        onClick={() => setShowModal(false)}
                        className="position-absolute top-0 end-0 m-3 z-3 bg-white opacity-75 rounded"
                    />

                    {image.mediaType === 'VIDEO' ? (
                        <video
                            src={image.imageUrl}
                            controls
                            autoPlay
                            className="w-100 h-100"
                            style={{ maxHeight: '90vh', objectFit: 'contain' }}
                        />
                    ) : (
                        <img
                            src={image.imageUrl}
                            alt={image.title}
                            className="img-fluid"
                            style={{ maxHeight: '90vh', objectFit: 'contain' }}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};