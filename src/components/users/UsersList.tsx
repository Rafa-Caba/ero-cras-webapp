import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useUsersStore } from '../../store/admin/useUsersStore';

export const AdminUsersList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const {
        users,
        currentPage,
        totalPages,
        loading,
        fetchUsers,
        deleteUserById,
        setCurrentPage
    } = useUsersStore();

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al usuario permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        if (result.isConfirmed) {
            try {
                await deleteUserById(id);
                Swal.fire('Eliminado', 'El usuario ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error');
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestión de Usuarios</h2>
                <div>
                    <Link to="/admin/users/new" className="btn general_btn me-2"> + Nuevo Usuario</Link>
                </div>
            </div>

            <div className="mb-4">
                <InputGroup>
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por nombre, usuario o correo..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
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
                                <th>Avatar</th>
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Instrumento</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-muted">
                                        No se encontraron usuarios.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td style={{ width: '80px' }}>
                                            <Image
                                                src={user.imageUrl || 'https://via.placeholder.com/50'}
                                                roundedCircle
                                                width={40}
                                                height={40}
                                                style={{ objectFit: 'cover' }}
                                                alt={user.username}
                                            />
                                        </td>
                                        <td className="fw-bold">{user.name}</td>
                                        <td>@{user.username}</td>
                                        <td>
                                            <span
                                                className={`badge ${user.role === 'SUPER_ADMIN'
                                                    ? 'bg-dark'
                                                    : user.role === 'ADMIN'
                                                        ? 'bg-danger'
                                                        : user.role === 'EDITOR'
                                                            ? 'bg-warning text-dark'
                                                            : 'bg-secondary'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.instrumentLabel || user.instrument || '-'}</td>
                                        <td className="text-end">
                                            <Link
                                                to={`/admin/users/edit/${user.id}`}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(user.id)}
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

            {/* Pagination */}
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
