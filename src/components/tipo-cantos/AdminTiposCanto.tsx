import { useEffect, useState } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useTiposCantoStore } from '../../store/admin/useTiposCantoStore';
import { capitalizarPalabra } from '../../utils';

export const AdminTiposCanto = () => {
    const [busqueda, setBusqueda] = useState('');
    const {
        tipos,
        paginaActual,
        totalPaginas,
        loading,
        getTipos,
        deleteTipo,
        setPaginaActual
    } = useTiposCantoStore();

    useEffect(() => {
        getTipos(paginaActual);
    }, [paginaActual]);

    const handlePagina = (nuevaPagina: number) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    const handleEliminar = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el tipo de canto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await deleteTipo(id);
            Swal.fire('Eliminado', 'El tipo ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el tipo', 'error');
        }
    };

    // Se puede implementar búsqueda más adelante si agregas a la store una función como buscarTiposPorTexto
    // useEffect(() => {
    //     if (busqueda.trim() === '') {
    //         getTipos();
    //     }
    // }, [busqueda]);

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Tipos de Canto</h2>
                <div className="botones mb-3">
                    <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link>
                    <Link to="/admin/tipos-canto/new" className="btn general_btn me-2">Nuevo Tipo</Link>
                </div>
            </div>

            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Buscar por nombre"
                    className="form-control mb-2"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {loading
                ? <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                    <Spinner animation="border" />
                </div>
                : (
                    <>
                        <Table bordered hover responsive className="text-center align-middle mx-auto">
                            <thead className="table-dark">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Orden</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tipos.length === 0 ? (
                                    <tr><td colSpan={3}>No se encontraron tipos.</td></tr>
                                ) : (
                                    tipos.map(tipo => (
                                        <tr key={tipo._id}>
                                            <td>{capitalizarPalabra(tipo.nombre)}</td>
                                            <td>{tipo.orden}</td>
                                            <td>
                                                <Link
                                                    to={`/admin/tipos-canto/edit/${tipo._id}`}
                                                    className="btn general_btn mb-2 mb-md-0 me-2"
                                                >
                                                    Editar
                                                </Link>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleEliminar(tipo._id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>

                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <Button
                                variant="secondary"
                                onClick={() => handlePagina(paginaActual - 1)}
                                disabled={paginaActual === 1}
                            >
                                Anterior
                            </Button>

                            <span className="align-self-center">
                                Página {paginaActual} de {totalPaginas}
                            </span>

                            <Button
                                variant="secondary"
                                onClick={() => handlePagina(paginaActual + 1)}
                                disabled={paginaActual === totalPaginas}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </>
                )
            }
        </div>
    );
};