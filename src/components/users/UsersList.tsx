import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useUsuariosStore } from '../../store/admin/useUsuariosStore';
import { capitalizarPalabra } from '../../utils';

export const UsersList = () => {
    const [busqueda, setBusqueda] = useState('');
    const {
        usuarios,
        paginaActual,
        totalPaginas,
        cargando,
        fetchUsuarios,
        eliminarUsuarioPorId,
        setPaginaActual,
        buscarUsuariosPorTexto
    } = useUsuariosStore();

    useEffect(() => {
        fetchUsuarios(paginaActual);
    }, [paginaActual]);

    const handlePagina = (nuevaPagina: number) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    const deleteUser = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al usuario y su imagen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await eliminarUsuarioPorId(id);

            Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
        }
    };

    useEffect(() => {
        if (busqueda.trim() === '') {
            fetchUsuarios(); // si está vacío, traer todos
        } else {
            const delay = setTimeout(() => {
                buscarUsuariosPorTexto(busqueda);
            }, 500); // delay para evitar llamadas rápidas

            return () => clearTimeout(delay);
        }
    }, [busqueda]);

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Usuarios</h2>
                <div className="botones mb-3">
                    <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link>
                    <Link to="/admin/users/new_user" className="btn general_btn me-2">Nuevo Usuario</Link>
                </div>
            </div>

            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Buscar por nombre, username o correo"
                    className="form-control mb-2"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>
            <div className='mb-2'>
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
                                        <th>Username</th>
                                        <th>Rol de Usuario</th>
                                        <th>Correo</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.length === 0 ? (
                                        <tr><td colSpan={6}>No se encontraron usuarios con ese criterio.</td></tr>
                                    ) : (
                                        usuarios.map(usuario => (
                                            <tr key={usuario._id}>
                                                <td>
                                                    <Image
                                                        src={usuario.fotoPerfilUrl || '/images/default-user.png'}
                                                        roundedCircle
                                                        height={50}
                                                        width={50}
                                                        style={{ objectFit: 'cover' }}
                                                        alt={usuario.nombre}
                                                    />
                                                </td>
                                                <td>{usuario.nombre}</td>
                                                <td>{usuario.username}</td>
                                                <td>{capitalizarPalabra(usuario.rol)}</td>
                                                <td>{usuario.correo}</td>
                                                <td>
                                                    <Link to={`/admin/users/edit/${usuario._id}`} className="btn general_btn mb-2 mb-md-0 me-2">Editar</Link>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => deleteUser(usuario._id)}
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
