import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useMiembrosStore } from '../../store/useMiembrosStore';
import type { Miembro } from '../../types/miembros';

export const AdminMembers = () => {
    const [busqueda, setBusqueda] = useState('');
    const {
        miembros,
        paginaActual,
        totalPaginas,
        cargando,
        fetchMiembros,
        eliminarMiembroPorId,
        setPaginaActual,
        buscarMiembrosPorTexto
    } = useMiembrosStore();

    useEffect(() => {
        fetchMiembros(paginaActual);
    }, [paginaActual]);

    const handlePagina = (nuevaPagina: number) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    const deleteMiembro = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al miembro y su imagen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await eliminarMiembroPorId(id);
            Swal.fire('Eliminado', 'El miembro ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el miembro', 'error');
        }
    };

    useEffect(() => {
        if (busqueda.trim() === '') {
            fetchMiembros();
        } else {
            const delay = setTimeout(() => {
                buscarMiembrosPorTexto(busqueda);
            }, 500);
            return () => clearTimeout(delay);
        }
    }, [busqueda]);

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Miembros</h2>
                <div className="botones mb-3">
                    <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link>
                    <Link to="/admin/members/new_member" className="btn general_btn me-2">Nuevo Miembro</Link>
                </div>
            </div>

            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Buscar por nombre o instrumento"
                    className="form-control mb-2"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div className="mb-2">
                {cargando
                    ? <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <Spinner animation="border" />
                    </div>
                    : (
                        <>
                            <Table bordered hover responsive className="text-center align-middle mx-auto">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Foto</th>
                                        <th>Nombre</th>
                                        <th>Instrumento</th>
                                        <th>¿Tiene voz?</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {miembros.length === 0 ? (
                                        <tr><td colSpan={5}>No se encontraron miembros con ese criterio.</td></tr>
                                    ) : (
                                        miembros.map((miembro: Miembro) => (
                                            <tr key={miembro._id}>
                                                <td>
                                                    <Image
                                                        src={miembro.fotoPerfilUrl || '/images/default-user.png'}
                                                        roundedCircle
                                                        height={50}
                                                        width={50}
                                                        style={{ objectFit: 'cover' }}
                                                        alt={miembro.nombre}
                                                    />
                                                </td>
                                                <td>{miembro.nombre}</td>
                                                <td>{miembro.instrumento}</td>
                                                <td>{miembro.tieneVoz ? 'Sí' : 'No'}</td>
                                                <td>
                                                    <Link to={`/admin/members/edit/${miembro._id}`} className="btn general_btn mb-2 mb-md-0 me-2">Editar</Link>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => deleteMiembro(miembro._id)}
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
        </div>
    );
};
