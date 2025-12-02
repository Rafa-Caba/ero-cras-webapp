import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useThemeStore } from '../../store/admin/useThemeStore';
import { applyThemeToDocument } from '../../utils/applyThemeToDocument';

export const AdminThemeList = () => {
    const {
        themes,
        loading,
        fetchThemes,
        removeTheme
    } = useThemeStore();

    useEffect(() => {
        fetchThemes();
    }, []);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el tema permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await removeTheme(id);
            Swal.fire('Eliminado', 'El tema ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el tema', 'error');
        }
    };

    const handleApplyPreview = (theme: any) => {
        applyThemeToDocument(theme);
        Swal.fire('Vista Previa', 'Se ha aplicado el tema temporalmente a esta sesión.', 'info');
    };

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-4">
                <h2 className="mb-4">Temas del Sitio</h2>
                <div className="mb-3 d-flex gap-2">
                    {/* <Link to="/admin" className="btn general_btn px-3">Inicio</Link> */}
                    <Link to="/admin/themes/new" className="btn general_btn">Nuevo Tema</Link>
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
                            <th>Modo</th>
                            <th>Vista Previa (Fondo / Primario)</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {themes.length === 0 ? (
                            <tr><td colSpan={4}>No hay temas registrados.</td></tr>
                        ) : (
                            themes.map((theme) => (
                                <tr key={theme.id}>
                                    <td>{theme.name}</td>
                                    <td>{theme.isDark ? '🌙 Oscuro' : '☀️ Claro'}</td>
                                    <td>
                                        <div className="d-flex justify-content-center gap-2">
                                            <div
                                                style={{ width: 20, height: 20, backgroundColor: theme.backgroundColor, border: '1px solid #ccc' }}
                                                title="Fondo"
                                            />
                                            <div
                                                style={{ width: 20, height: 20, backgroundColor: theme.primaryColor, border: '1px solid #ccc' }}
                                                title="Primario"
                                            />
                                        </div>
                                    </td>
                                    <td className="d-flex flex-wrap gap-2 justify-content-center">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => handleApplyPreview(theme)}
                                        >
                                            👁️ Probar
                                        </Button>
                                        <Link
                                            to={`/admin/themes/edit/${theme.id}`}
                                            className="btn btn-sm btn-outline-primary fw-bolder"
                                        >
                                            Editar
                                        </Link>
                                        <Button
                                            variant="outline-danger"
                                            className='fw-bolder'
                                            size="sm"
                                            onClick={() => handleDelete(theme.id)}
                                        >
                                            Eliminar
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}
        </div>
    );
};