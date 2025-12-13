import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

import { useChoirsStore } from '../../store/admin/useChoirsStore';

export const AdminChoirList = () => {
    const {
        choirs,
        currentPage,
        totalPages,
        loading,
        fetchChoirs,
        deleteChoirById,
        setCurrentPage
    } = useChoirsStore();

    const safeChoirs = choirs ?? [];

    useEffect(() => {
        fetchChoirs(currentPage);
    }, [currentPage, fetchChoirs]);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el coro permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteChoirById(id);
            Swal.fire('Eliminado', 'El coro ha sido eliminado.', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar el coro.', 'error');
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Coros</h2>
                <Link to="/admin/choirs/new" className="btn general_btn me-2">
                    + Nuevo Coro
                </Link>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <Table hover bordered className="align-middle mb-0 bg-white">
                        <thead className="table-light">
                            <tr>
                                <th>Logo</th>
                                <th>Nombre</th>
                                <th>Código</th>
                                <th>Estado</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {safeChoirs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted">
                                        No se encontraron coros.
                                    </td>
                                </tr>
                            ) : (
                                safeChoirs.map((choir) => (
                                    <tr key={choir.id}>
                                        <td style={{ width: '80px' }}>
                                            <Image
                                                src={
                                                    choir.logoUrl ||
                                                    'https://via.placeholder.com/50x50?text=C'
                                                }
                                                roundedCircle
                                                width={40}
                                                height={40}
                                                style={{ objectFit: 'cover' }}
                                                alt={choir.name}
                                            />
                                        </td>
                                        <td className="fw-bold">{choir.name}</td>
                                        <td>
                                            <code>{choir.code}</code>
                                        </td>
                                        <td>
                                            <Badge bg={choir.isActive ? 'success' : 'secondary'}>
                                                {choir.isActive ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </td>
                                        <td className="text-center text-md-end">
                                            <Link
                                                to={`/admin/choirs/edit/${choir.id}`}
                                                className="btn btn-sm btn-outline-primary me-1 me-md-2"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(choir.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-4">
                    <Button
                        variant="secondary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Anterior
                    </Button>
                    <span className="align-self-center px-2">
                        Página {currentPage} de {totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
};
