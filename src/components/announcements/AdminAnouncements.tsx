import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';

import { useAvisosStore } from '../../store/admin/useAvisosStore';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';

export const AdminAnnouncements = () => {
    const [busqueda, setBusqueda] = useState('');
    const [avisoSeleccionado, setAvisoSeleccionado] = useState<any | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const {
        avisos,
        paginaActual,
        totalPaginas,
        cargando,
        fetchAvisos,
        eliminarAvisoPorId,
        setPaginaActual,
        buscarAvisosPorTexto
    } = useAvisosStore();

    useEffect(() => {
        fetchAvisos(paginaActual);
    }, [paginaActual]);

    const handlePagina = (nuevaPagina: number) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    const deleteAviso = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el aviso y su imagen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await eliminarAvisoPorId(id);
            Swal.fire('Eliminado', 'El aviso ha sido eliminado.', 'success');
        } catch {
            Swal.fire('Error', 'No se pudo eliminar el aviso', 'error');
        }
    };

    useEffect(() => {
        if (busqueda.trim() === '') {
            fetchAvisos();
        } else {
            const delay = setTimeout(() => buscarAvisosPorTexto(busqueda), 500);
            return () => clearTimeout(delay);
        }
    }, [busqueda]);

    const abrirModal = (aviso: any) => {
        setAvisoSeleccionado(aviso);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setAvisoSeleccionado(null);
        setMostrarModal(false);
    };

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Avisos</h2>
                <div className="botones mb-3">
                    <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link>
                    <Link to="/admin/announcements/new_announcement" className="btn general_btn me-2">Nuevo Aviso</Link>
                </div>
            </div>

            <input
                type="text"
                placeholder="Buscar por título"
                className="form-control mb-2"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            {cargando ? (
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
                            {avisos.length === 0 ? (
                                <tr><td colSpan={5}>No se encontraron avisos con ese criterio.</td></tr>
                            ) : (
                                avisos.map(aviso => (
                                    <tr key={aviso._id}>
                                        <td>
                                            <Image
                                                src={aviso.imagenUrl || '/images/default-image.png'}
                                                height={50}
                                                width={50}
                                                style={{ objectFit: 'cover' }}
                                                alt={aviso.titulo}
                                                rounded
                                            />
                                        </td>
                                        <td>{aviso.titulo}</td>
                                        <td>
                                            <Button
                                                size="sm"
                                                variant="outline-secondary"
                                                onClick={() => abrirModal(aviso)}
                                            >
                                                Ver más
                                            </Button>
                                        </td>
                                        <td>{aviso.publicado ? '✅' : '❌'}</td>
                                        <td>
                                            <Link to={`/admin/announcements/edit/${aviso._id}`} className="btn general_btn mb-2 mb-md-0 me-2">Editar</Link>
                                            <Button variant="danger" onClick={() => deleteAviso(aviso._id)}>Eliminar</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-center gap-2 mt-3">
                        <Button variant="secondary" onClick={() => handlePagina(paginaActual - 1)} disabled={paginaActual === 1}>Anterior</Button>
                        <span className="align-self-center">Página {paginaActual} de {totalPaginas}</span>
                        <Button variant="secondary" onClick={() => handlePagina(paginaActual + 1)} disabled={paginaActual === totalPaginas}>Siguiente</Button>
                    </div>
                </>
            )}

            {/* MODAL DE PREVISUALIZACIÓN */}
            <Modal show={mostrarModal} onHide={cerrarModal} size="lg" centered>
                <Modal.Header closeButton className="justify-content-between align-items-center">
                    <div className="d-flex align-items-center w-100 justify-content-between">
                        <Modal.Title className="mb-0">{avisoSeleccionado?.titulo}</Modal.Title>

                        {avisoSeleccionado?.imagenUrl && (
                            <Image
                                src={avisoSeleccionado.imagenUrl}
                                height={40}
                                width={40}
                                rounded
                                alt="Miniatura"
                                style={{ objectFit: 'cover', marginLeft: '1rem', marginRight: '1rem' }}
                            />
                        )}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    {avisoSeleccionado?.contenido && (
                        <TiptapViewer content={avisoSeleccionado.contenido} />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};