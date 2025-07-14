import { Modal, Button } from 'react-bootstrap';
import type { ThemeGroup } from '../../types';

interface Props {
    show: boolean;
    onClose: () => void;
    themeGroups: ThemeGroup[];
    onSelect: (grupo: ThemeGroup) => void;
}

export const ThemeSelectorModal = ({ show, onClose, themeGroups, onSelect }: Props) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>🎨 Cambiar tema visual</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {themeGroups.map((grupo) => (
                    <div
                        key={grupo._id}
                        onClick={() => onSelect(grupo)}
                        className="mb-3 p-2 border rounded theme-option cursor-pointer"
                        style={{ transition: 'all 0.2s' }}
                    >
                        <strong>{grupo.nombre}</strong>
                        <div className="d-flex mt-2 flex-wrap gap-1">
                            {grupo.colores.map((color) => (
                                <div
                                    key={color.colorClass}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: color.color,
                                        borderRadius: 4,
                                        border: '1px solid #ccc'
                                    }}
                                    title={`${color.nombre}: ${color.color}`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            </Modal.Footer>
        </Modal>
    );
};
