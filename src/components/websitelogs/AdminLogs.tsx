import { useEffect, useState } from 'react';
import { Table, Spinner, Button, Form } from 'react-bootstrap';
import { useLogStore } from '../../store/admin/useLogStore';
import { capitalizeWord } from '../../utils/capitalize';

export const AdminLogs = () => {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<{ collectionName?: string; action?: string }>({});

    const {
        logs,
        loading,
        currentPage,
        totalPages,
        fetchLogs,
        setPage,
        searchLogsText
    } = useLogStore();

    useEffect(() => {
        fetchLogs(currentPage, filters);
    }, [currentPage, filters]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (search.trim()) {
                searchLogsText(search);
            } else {
                fetchLogs(1, filters);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);

    return (
        <div className="table-responsive mt-3 px-md-3">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-3 text-center">Bitácora de Cambios</h2>
                <div className="botones mb-3">
                    {/* <Link to="/admin" className="btn general_btn px-3 m-2">Ir al Inicio</Link> */}
                </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-md-row justify-content-between gap-2">
                <input
                    type="text"
                    placeholder="Buscar por ID, username, colección..."
                    className="form-control"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <Form.Select
                    className="w-auto"
                    value={filters.collectionName || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, collectionName: e.target.value || undefined }))}
                >
                    <option value="">Todas las colecciones</option>
                    <option value="Songs">Cantos</option>
                    <option value="GalleryImages">Imágenes</option>
                    <option value="Members">Miembros</option>
                    <option value="Announcements">Avisos</option>
                    <option value="BlogPosts">BlogPosts</option>
                    <option value="Themes">Themes</option>
                    <option value="Users">Usuarios</option>
                    <option value="Settings">Settings</option>
                </Form.Select>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive className="text-center align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Usuario</th>
                                <th>Colección</th>
                                <th>Acción</th>
                                <th>ID Referencia</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>No hay registros</td>
                                </tr>
                            ) : (
                                logs.map(log => (
                                    <tr key={log.id}>
                                        <td>
                                            <div>{'name' in log.user ? log.user.name : 'Unknown'}</div>
                                            <small>@{'username' in log.user ? log.user.username : ''}</small>
                                        </td>
                                        <td>{log.collectionName}</td>
                                        <td>{capitalizeWord(log.action)}</td>
                                        <td>{log.referenceId}</td>
                                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                        <Button
                            variant="secondary"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Anterior
                        </Button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <Button
                            variant="secondary"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Siguiente
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};