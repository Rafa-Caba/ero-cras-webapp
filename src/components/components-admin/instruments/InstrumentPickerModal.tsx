import { useMemo, useState, type ChangeEvent } from 'react';
import { Modal, Button, Form, Row, Col, Image, Badge } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import type { Instrument } from '../../../types/instrument';

interface InstrumentPickerModalProps {
    show: boolean;
    onClose: () => void;
    instruments?: Instrument[];
    selectedInstrumentId?: string | null;
    onSelectInstrument: (instrument: Instrument | null) => void;
}

export const InstrumentPickerModal = ({
    show,
    onClose,
    instruments = [],
    selectedInstrumentId,
    onSelectInstrument,
}: InstrumentPickerModalProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInstruments = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return instruments.filter((inst) =>
            inst.name.toLowerCase().includes(term) ||
            inst.slug.toLowerCase().includes(term) ||
            (inst.category || '').toLowerCase().includes(term)
        );
    }, [instruments, searchTerm]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelect = (instrument: Instrument) => {
        onSelectInstrument(instrument);
        onClose();
    };

    const handleClearSelection = () => {
        onSelectInstrument(null);
        onClose();
    };

    const handleHide = () => {
        onClose();
    };

    return (
        <Modal
            show={show}
            onHide={handleHide}
            size="lg"
            centered
            backdrop="static"
            keyboard
        >
            <Modal.Header closeButton>
                <Modal.Title>Seleccionar instrumento</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form className="mb-3">
                    <Form.Group controlId="instrumentSearch">
                        <div className="d-flex align-items-center gap-2">
                            <FaSearch />
                            <Form.Control
                                type="text"
                                placeholder="Buscar por nombre, slug o categoría..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </Form.Group>
                </Form>

                {filteredInstruments.length === 0 ? (
                    <p className="text-muted text-center mb-0">
                        No se encontraron instrumentos con ese criterio.
                    </p>
                ) : (
                    <Row xs={1} md={2} className="g-3">
                        {filteredInstruments.map((inst) => {
                            const isSelected = inst.id === selectedInstrumentId;
                            return (
                                <Col key={inst.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(inst)}
                                        className={`w-100 text-start border rounded p-2 d-flex align-items-center gap-3 bg-white ${isSelected ? 'border-primary shadow-sm' : 'border-light'
                                            }`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div
                                            style={{
                                                width: 150,
                                                height: 200,
                                                borderRadius: 12,
                                                border: '1px solid #eee',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden',
                                                backgroundColor: '#f8f9fa'
                                            }}
                                        >
                                            {inst.iconUrl ? (
                                                <Image
                                                    src={inst.iconUrl}
                                                    alt={inst.name}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain',
                                                    }}
                                                />
                                            ) : (
                                                <span className="small text-muted">
                                                    {inst.iconKey || 'Icono'}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <strong>{inst.name}</strong>
                                                {inst.isActive ? (
                                                    <Badge bg="success" pill>Activo</Badge>
                                                ) : (
                                                    <Badge bg="secondary" pill>Inactivo</Badge>
                                                )}
                                            </div>
                                            <small className="text-muted d-block">
                                                Slug: <code>{inst.slug}</code>
                                            </small>
                                            {inst.category && (
                                                <small className="text-muted">
                                                    Categoría: {inst.category}
                                                </small>
                                            )}
                                        </div>
                                    </button>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="outline-secondary"
                    onClick={handleClearSelection}
                    type="button"
                >
                    Quitar instrumento
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleHide}
                    type="button"
                >
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
