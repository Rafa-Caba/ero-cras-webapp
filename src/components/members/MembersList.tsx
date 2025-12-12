import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useMemberStore } from '../../store/admin/useMemberStore';
import type { Member } from '../../types/member';

export const MembersList = () => {
    const [searchText, setSearchText] = useState('');

    const {
        members,
        currentPage,
        totalPages,
        loading,
        fetchMembers,
        removeMember,
        setCurrentPage,
        searchMembersByText
    } = useMemberStore();

    useEffect(() => {
        fetchMembers(currentPage);
    }, [currentPage, fetchMembers]);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (searchText.trim() === '') {
                if (members.length === 0 && !loading) fetchMembers(1);
            } else {
                searchMembersByText(searchText);
            }
        }, 500);
        return () => clearTimeout(delay);
    }, [searchText, members.length, loading, fetchMembers, searchMembersByText]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará al miembro y su imagen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await removeMember(id);
            Swal.fire('Eliminado', 'El miembro ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el miembro', 'error');
        }
    };

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Miembros</h2>
                <div className="botones mb-3">
                    <Link to="/admin/members/new" className="btn general_btn me-2">
                        Nuevo Miembro
                    </Link>
                </div>
            </div>

            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Buscar por nombre o instrumento"
                    className="form-control mb-2"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>

            <div className="mb-2">
                {loading ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: '300px' }}
                    >
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        <Table
                            bordered
                            hover
                            responsive
                            className="text-center align-middle mx-auto"
                        >
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
                                {members.length === 0 ? (
                                    <tr>
                                        <td colSpan={5}>
                                            No se encontraron miembros con ese criterio.
                                        </td>
                                    </tr>
                                ) : (
                                    members.map((member: Member) => (
                                        <tr key={member.id}>
                                            <td>
                                                <Image
                                                    src={
                                                        member.imageUrl ||
                                                        '/images/default-user.png'
                                                    }
                                                    roundedCircle
                                                    height={50}
                                                    width={50}
                                                    style={{ objectFit: 'cover' }}
                                                    alt={member.name}
                                                />
                                            </td>
                                            <td>{member.name}</td>
                                            <td>
                                                {(member as any).instrumentLabel ||
                                                    (member as any).instrument ||
                                                    '-'}
                                            </td>
                                            <td>{member.voice ? 'Sí' : 'No'}</td>
                                            <td>
                                                <Link
                                                    to={`/admin/members/edit/${member.id}`}
                                                    className="btn general_btn mb-2 mb-md-0 me-2"
                                                >
                                                    Editar
                                                </Link>
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(member.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>

                        {totalPages > 1 && (
                            <div className="d-flex justify-content-center gap-2 mt-3">
                                <Button
                                    variant="secondary"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>

                                <span className="align-self-center">
                                    Página {currentPage} de {totalPages}
                                </span>

                                <Button
                                    variant="secondary"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
