import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { useAnnouncementStore } from '../../store/admin/useAnnouncementStore';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import type { Announcement } from '../../types/annoucement';

export const AdminAnnouncements = () => {
    const [search, setSearch] = useState('');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [showModal, setShowModal] = useState(false);

    const {
        announcements,
        loading,
        fetchAnnouncements,
        removeAnnouncement,
    } = useAnnouncementStore();

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const filteredAnnouncements = announcements.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el aviso y su imagen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await removeAnnouncement(id);
            Swal.fire('Eliminado', 'El aviso ha sido eliminado.', 'success');
        } catch {
            Swal.fire('Error', 'No se pudo eliminar el aviso', 'error');
        }
    };

    const openModal = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setShowModal(true);
    };

    const closeModal = () => {
        setSelectedAnnouncement(null);
        setShowModal(false);
    };

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Avisos</h2>
                <div className="botones mb-3">
                    {/* <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link> */}
                    <Link to="/admin/announcements/new" className="btn general_btn me-2">Nuevo Aviso</Link>
                </div>
            </div>

            <input
                type="text"
                placeholder="Buscar por título"
                className="form-control mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <Table bordered hover responsive className="text-center align-middle mx-auto">
                        <thead className="table-dark">
                            <tr>
                                <th>Imagen</th>
                                <th>Título</th>
                                <th>Contenido</th>
                                <th>Publicado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAnnouncements.length === 0 ? (
                                <tr><td colSpan={5}>No se encontraron avisos con ese criterio.</td></tr>
                            ) : (
                                filteredAnnouncements.map(announcement => (
                                    <tr key={announcement.id}>
                                        <td>
                                            <Image
                                                // Logic migration: imagenUrl -> imageUrl
                                                src={announcement.imageUrl || '/images/default-image.png'}
                                                height={50}
                                                width={50}
                                                style={{ objectFit: 'cover' }}
                                                alt={announcement.title}
                                                rounded
                                            />
                                        </td>
                                        <td>{announcement.title}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => openModal(announcement)}
                                            >
                                                Ver más
                                            </Button>
                                        </td>
                                        {/* Logic migration: publicado -> isPublic */}
                                        <td>{announcement.isPublic ? '✅' : '❌'}</td>
                                        <td>
                                            <Link to={`/admin/announcements/edit/${announcement.id}`} className="btn general_btn mb-2 mb-md-0 me-2">Editar</Link>
                                            <Button variant="danger" onClick={() => handleDelete(announcement.id)}>Eliminar</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </>
            )}

            {/* MODAL DE PREVISUALIZACIÓN */}
            <Modal show={showModal} onHide={closeModal} size="lg" centered>
                <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center w-100 justify-content-center">
                        <Modal.Title className="ms-3">{selectedAnnouncement?.title}</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {selectedAnnouncement?.imageUrl && (
                        <Image
                            src={selectedAnnouncement.imageUrl}
                            alt="imagen aviso"
                            width={150}
                            height={150}
                            roundedCircle
                            className="border border-light mb-3"
                        />
                    )}
                    {selectedAnnouncement?.content && (
                        <TiptapViewer content={selectedAnnouncement.content} />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='px-3' style={{ borderRadius: 10 }} onClick={closeModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};