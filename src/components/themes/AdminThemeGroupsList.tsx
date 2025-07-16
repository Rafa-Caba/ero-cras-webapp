import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useThemeGroupsStore } from '../../store/admin/useThemeGroupsStore';

export const AdminThemeGroupsList = () => {
    const {
        grupos,
        cargando,
        paginaActual,
        totalPaginas,
        fetchGrupos,
        eliminarGrupoPorId,
        setPaginaActual,
        publicarGrupoComoPublico,
        activarGrupo
    } = useThemeGroupsStore();

    useEffect(() => {
        fetchGrupos(paginaActual);
    }, [paginaActual]);

    const handleEliminar = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el grupo de temas y no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await eliminarGrupoPorId(id);
            Swal.fire('Eliminado', 'El grupo ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el grupo', 'error');
        }
    };

    const handleHacerPublico = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Hacer público este tema?',
            text: 'Este grupo será el tema visual del sitio público.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, publicar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await publicarGrupoComoPublico(id);
            Swal.fire('Publicado', 'El tema fue marcado como público.', 'success');
            fetchGrupos(paginaActual);
        } catch {
            Swal.fire('Error', 'No se pudo hacer público el tema.', 'error');
        }
    };

    const handleActivarAdmin = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Activar para panel admin?',
            text: 'Este grupo será el tema visual para los administradores.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await activarGrupo(id);
            Swal.fire('Activado', 'El tema fue marcado como activo en el panel admin.', 'success');
            fetchGrupos(paginaActual);
        } catch {
            Swal.fire('Error', 'No se pudo activar el tema para admin.', 'error');
        }
    };

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-4">
                <h2 className="mb-4">Grupos de Temas</h2>
                <div className="mb-3 d-flex gap-2">
                    <Link to="/admin" className="btn general_btn px-3">Inicio</Link>
                    <Link to="/admin/theme-groups/new" className="btn general_btn">Nuevo Grupo</Link>
                </div>
            </div>

            {cargando ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <Spinner animation="border" />
                </div>
            ) : (
                <Table bordered hover responsive className="text-center align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre del Grupo</th>
                            <th># Colores</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grupos.length === 0 ? (
                            <tr><td colSpan={4}>No hay grupos de temas registrados.</td></tr>
                        ) : (
                            grupos.map(({ _id, nombre, colores, esTemaPublico, activo }) => (
                                <tr key={_id}>
                                    <td>{nombre}</td>
                                    <td>{colores.length}</td>
                                    <td>
                                        {esTemaPublico && <span className="badge bg-success me-1">🌐 Público</span>}
                                        {activo && <span className="badge bg-primary">⚙️ Admin</span>}
                                    </td>
                                    <td className="d-flex flex-wrap gap-2 justify-content-center">
                                        <Link
                                            to={`/admin/theme-groups/edit/${_id}`}
                                            className="btn btn-sm btn-outline-primary fw-bolder"
                                        >
                                            Editar
                                        </Link>

                                        <Button
                                            variant="outline-danger"
                                            className='fw-bolder'
                                            size="sm"
                                            onClick={() => handleEliminar(_id!)}
                                        >
                                            Eliminar
                                        </Button>

                                        {!esTemaPublico && (
                                            <Button
                                                variant="outline-success"
                                                className='fw-bolder'
                                                size="sm"
                                                onClick={() => handleHacerPublico(_id!)}
                                            >
                                                🌐 Hacer público
                                            </Button>
                                        )}

                                        {!activo && (
                                            <Button
                                                className='btn-outline-morado fw-bolder'
                                                size="sm"
                                                onClick={() => handleActivarAdmin(_id!)}
                                            >
                                                ⚙️ Activar Admin
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            {totalPaginas > 1 && (
                <div className="d-flex justify-content-center gap-2 mt-3">
                    <Button
                        variant="secondary"
                        onClick={() => setPaginaActual(paginaActual - 1)}
                        disabled={paginaActual === 1}
                    >
                        Anterior
                    </Button>

                    <span className="align-self-center">
                        Página {paginaActual} de {totalPaginas}
                    </span>

                    <Button
                        variant="secondary"
                        onClick={() => setPaginaActual(paginaActual + 1)}
                        disabled={paginaActual === totalPaginas}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
};
