import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Table,
    Image,
    Button,
    Spinner,
    Form,
    InputGroup,
    Badge
} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { useInstrumentsStore } from '../../../store/admin/useInstrumentsStore';
import type { Instrument } from '../../../types/instrument';


export const AdminInstrumentsList = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const {
        instruments,
        loading,
        fetchInstruments,
        deleteInstrumentById
    } = useInstrumentsStore();

    useEffect(() => {
        void fetchInstruments();
    }, [fetchInstruments]);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el instrumento permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6'
        });

        if (!result.isConfirmed) return;

        try {
            await deleteInstrumentById(id);
            Swal.fire('Eliminado', 'El instrumento ha sido eliminado.', 'success');
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'No se pudo eliminar el instrumento.', 'error');
        }
    };

    const filteredInstruments = instruments.filter((inst: Instrument) => {
        const term = searchTerm.toLowerCase();
        return (
            inst.name.toLowerCase().includes(term) ||
            inst.slug.toLowerCase().includes(term) ||
            inst.category.toLowerCase().includes(term) ||
            inst.iconKey.toLowerCase().includes(term)
        );
    });

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 className="mb-0">Gestión de Instrumentos</h2>
                <div>
                    <Link to="/admin/instruments/new" className="btn general_btn">
                        + Nuevo Instrumento
                    </Link>
                </div>
            </div>

            <div className="mb-4">
                <InputGroup>
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                    <Form.Control
                        placeholder="Buscar por nombre, slug, categoría o iconKey..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </InputGroup>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <div className="table-responsive shadow-sm rounded">
                    <Table hover bordered className="align-middle mb-0 bg-white">
                        <thead className="table-light">
                            <tr>
                                <th>Ícono</th>
                                <th>Nombre</th>
                                <th>Slug</th>
                                <th>Categoría</th>
                                <th>Icon Key</th>
                                <th>Orden</th>
                                <th>Activo</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInstruments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-muted">
                                        No se encontraron instrumentos.
                                    </td>
                                </tr>
                            ) : (
                                filteredInstruments.map((inst) => (
                                    <tr key={inst.id}>
                                        <td style={{ width: '70px' }}>
                                            {inst.iconUrl ? (
                                                <Image
                                                    src={inst.iconUrl}
                                                    roundedCircle
                                                    width={40}
                                                    height={40}
                                                    style={{ objectFit: 'contain' }}
                                                    alt={inst.name}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        border: '1px dashed #ccc',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: 12,
                                                        color: '#999'
                                                    }}
                                                >
                                                    Sin icono
                                                </div>
                                            )}
                                        </td>
                                        <td className="fw-semibold">{inst.name}</td>
                                        <td><code>{inst.slug}</code></td>
                                        <td>{inst.category || '-'}</td>
                                        <td><small>{inst.iconKey}</small></td>
                                        <td>{inst.order}</td>
                                        <td>
                                            <Badge bg={inst.isActive ? 'success' : 'secondary'}>
                                                {inst.isActive ? 'Sí' : 'No'}
                                            </Badge>
                                        </td>
                                        <td className="text-end">
                                            <Link
                                                to={`/admin/instruments/edit/${inst.id}`}
                                                className="btn btn-sm btn-outline-primary me-2"
                                            >
                                                <FaEdit />
                                            </Link>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(inst.id)}
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
        </div>
    );
};
