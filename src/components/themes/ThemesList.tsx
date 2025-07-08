// 📁 components/admin/ThemesList.tsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useThemesStore } from '../../store/admin/useThemesStore';

export const ThemesList = () => {
    const {
        themes,
        loading,
        getAllThemes,
        deleteColorClass,
        paginaActual,
        totalPaginas,
        setPaginaActual
    } = useThemesStore();

    useEffect(() => {
        getAllThemes();
    }, []);

    const deleteColor = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará esta clase de color del tema',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await deleteColorClass(id);
            Swal.fire('Eliminado', 'La clase de color ha sido eliminada.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar la clase de color', 'error');
        }
    };

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-4">
                <h2 className="mb-4">Clases de Color del Tema</h2>
                <div className="mb-3 d-flex gap-2">
                    <Link to="/admin" className="btn general_btn px-3">Inicio</Link>
                    <Link to="/admin/themes/new_class_color" className="btn general_btn">Nueva Clase de Color</Link>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                    <Spinner animation="border" />
                </div>
            ) : (
                <Table bordered hover responsive className="text-center align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Clase</th>
                            <th>Color</th>
                            <th>Vista</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {themes.length === 0 ? (
                            <tr><td colSpan={5}>No hay clases de color registradas.</td></tr>
                        ) : (
                            themes.map(({ _id, nombre, colorClass, color }) => (
                                <tr key={_id}>
                                    <td>{nombre}</td>
                                    <td><code>{colorClass}</code></td>
                                    <td><code>{color}</code></td>
                                    <td>
                                        <div style={{ width: '40px', height: '40px', backgroundColor: color, borderRadius: '6px', border: '1px solid #ccc', margin: '0 auto' }} />
                                    </td>
                                    <td>
                                        <Link to={`/admin/edit_class_color/${_id}`} className="btn general_btn me-2">Editar</Link>
                                        <Button variant="danger" onClick={() => deleteColor(_id!)}>Eliminar</Button>
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