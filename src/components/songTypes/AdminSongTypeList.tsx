import { useEffect, useState } from 'react';
import { Button, Spinner, Table, Breadcrumb } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { FaFolder, FaArrowLeft, FaMusic } from 'react-icons/fa';
import type { SongType } from '../../types';
import { useSongTypeStore } from '../../store/admin/useSongTypeStore';
import { capitalizeWord } from '../../utils';

export const AdminSongTypeList = () => {
    const [search, setSearch] = useState('');

    const [currentParent, setCurrentParent] = useState<SongType | null>(null);

    const {
        types,
        loading,
        fetchTypes,
        removeType,
    } = useSongTypeStore();

    useEffect(() => {
        fetchTypes();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el tipo de canto',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await removeType(id);
            Swal.fire('Eliminado', 'El tipo ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el tipo', 'error');
        }
    };

    // 🟢 HIERARCHY FILTER LOGIC
    const filteredTypes = types.filter(t => {
        if (search.trim() !== '') {
            return t.name.toLowerCase().includes(search.toLowerCase());
        }

        if (currentParent) {
            return t.parentId === currentParent.id;
        }

        return !t.parentId;
    });

    const handleEnterFolder = (type: SongType) => {
        setCurrentParent(type);
        setSearch('');
    };

    const handleGoBack = () => {
        setCurrentParent(null);
        setSearch('');
    };

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Tipos de Canto</h2>
                <div className="botones mb-3">
                    {/* <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link> */}
                    <Link to="/admin/song-types/new" className="btn general_btn me-2">Nuevo Tipo</Link>
                </div>
            </div>

            {/* 🟢 NAVIGATION BAR & SEARCH */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
                <div className="w-100">
                    {currentParent ? (
                        <div className="d-flex align-items-center gap-2 bg-light p-2 rounded border">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleGoBack}
                                title="Volver al inicio"
                            >
                                <FaArrowLeft />
                            </Button>
                            <Breadcrumb className="m-0 p-0">
                                <Breadcrumb.Item onClick={handleGoBack}>Principal</Breadcrumb.Item>
                                <Breadcrumb.Item active className="fw-bold text-primary">
                                    📁 {capitalizeWord(currentParent.name)}
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    ) : (
                        <h5 className="text-muted m-0 p-2">📂 Directorio Principal</h5>
                    )}
                </div>

                <div className="w-100">
                    <input
                        type="text"
                        placeholder="🔍 Buscar globalmente..."
                        className="form-control"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
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
                                    <th className="text-start ps-4">Nombre</th>
                                    <th>Orden</th>
                                    <th>Tipo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTypes.length === 0 ? (
                                    <tr><td colSpan={4} className="py-4 text-muted">La carpeta está vacía o no hay resultados.</td></tr>
                                ) : (
                                    filteredTypes.map(type => {
                                        return (
                                            <tr key={type.id}>
                                                <td className="text-start ps-4">
                                                    {type.isParent ? (
                                                        <span
                                                            className="text-primary fw-bold cursor-pointer d-flex align-items-center gap-2"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => handleEnterFolder(type)}
                                                        >
                                                            <FaFolder size={18} className="text-warning" />
                                                            {capitalizeWord(type.name)}
                                                        </span>
                                                    ) : (
                                                        <span className="d-flex align-items-center gap-2">
                                                            <FaMusic size={14} className="text-secondary" />
                                                            {capitalizeWord(type.name)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{type.order}</td>
                                                <td>
                                                    {type.isParent
                                                        ? <span className="badge bg-warning text-dark">Carpeta</span>
                                                        : <span className="badge bg-light text-dark border">Categoría</span>
                                                    }
                                                </td>
                                                <td>
                                                    <Link
                                                        to={`/admin/song-types/edit/${type.id}`}
                                                        className="btn general_btn mb-2 mb-md-0 me-2 btn-sm"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(type.id)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </Table>
                    </>
                )
            }
        </div>
    );
};