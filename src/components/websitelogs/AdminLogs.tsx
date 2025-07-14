import { useEffect, useState } from 'react';
import { Table, Spinner, Button, Form } from 'react-bootstrap';
import { useLogsStore } from '../../store/admin/useLogsStore';
import { capitalizarPalabra } from '../../utils/capitalizar';
import { Link } from 'react-router-dom';

export const AdminLogs = () => {
    const [busqueda, setBusqueda] = useState('');
    const [filtros, setFiltros] = useState<{ coleccion?: string; accion?: string }>({});

    const {
        logs,
        cargando,
        paginaActual,
        totalPaginas,
        fetchLogs,
        setPaginaActual,
        buscarLogsTexto
    } = useLogsStore();

    useEffect(() => {
        fetchLogs(paginaActual, filtros);
    }, [paginaActual, filtros]);

    const handlePagina = (nuevaPagina: number) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (busqueda.trim()) {
                buscarLogsTexto(busqueda);
            } else {
                fetchLogs(1, filtros);
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [busqueda]);

    return (
        <div className="table-responsive mt-3 px-md-3">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-3 text-center">Bitácora de Cambios</h2>
                <div className="botones mb-3">
                    <Link to="/admin" className="btn general_btn px-3 m-2">Ir al Inicio</Link>
                </div>
            </div>

            <div className="mb-3 d-flex flex-column flex-md-row justify-content-between gap-2">
                <input
                    type="text"
                    placeholder="Buscar por ID, username, colección..."
                    className="form-control"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <Form.Select
                    className="w-auto"
                    value={filtros.coleccion || ''}
                    onChange={(e) => setFiltros(prev => ({ ...prev, coleccion: e.target.value || undefined }))}
                >
                    <option value="">Todas las colecciones</option>
                    <option value="Cantos">Cantos</option>
                    <option value="Imagenes">Imágenes</option>
                    <option value="Miembros">Miembros</option>
                    <option value="Avisos">Avisos</option>
                    <option value="BlogPosts">BlogPosts</option>
                    <option value="Themes">Themes</option>
                    <option value="Usuarios">Usuarios</option>
                    <option value="Settings">Settings</option>
                </Form.Select>
            </div>

            {cargando ? (
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
                                    <tr key={log._id}>
                                        <td>
                                            <div>{log.usuario.nombre}</div>
                                            <small>@{log.usuario.username}</small>
                                        </td>
                                        <td>{log.coleccion}</td>
                                        <td>{capitalizarPalabra(log.accion)}</td>
                                        <td>{log.referenciaId}</td>
                                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
                        <Button
                            variant="secondary"
                            onClick={() => handlePagina(paginaActual - 1)}
                            disabled={paginaActual === 1}
                        >
                            Anterior
                        </Button>
                        <span>Página {paginaActual} de {totalPaginas}</span>
                        <Button
                            variant="secondary"
                            onClick={() => handlePagina(paginaActual + 1)}
                            disabled={paginaActual === totalPaginas}
                        >
                            Siguiente
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};