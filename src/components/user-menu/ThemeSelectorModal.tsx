import { Modal, Button } from 'react-bootstrap';
import type { Theme } from '../../types/theme';

interface Props {
    show: boolean;
    onClose: () => void;
    themes: Theme[];
    onSelect: (theme: Theme) => void;
}

export const ThemeSelectorModal = ({ show, onClose, themes, onSelect }: Props) => {
    return (
        <Modal show={show} onHide={onClose} centered scrollable>
            <Modal.Header closeButton>
                <Modal.Title>🎨 Cambiar tema visual</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {themes.length === 0 ? (
                    <p className="text-center text-muted">No hay temas disponibles.</p>
                ) : (
                    themes.map((theme) => (
                        <div
                            key={theme.id}
                            onClick={() => onSelect(theme)}
                            className="mb-3 p-3 border rounded theme-option cursor-pointer d-flex align-items-center justify-content-between"
                            style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                        >
                            <div>
                                <strong className="d-block">{theme.name}</strong>
                                <small className="text-muted">{theme.isDark ? 'Modo Oscuro' : 'Modo Claro'}</small>
                            </div>

                            <div className="d-flex gap-1">
                                <div style={{ width: 24, height: 24, backgroundColor: theme.backgroundColor, border: '1px solid #ccc', borderRadius: 4 }} title="Fondo" />
                                <div style={{ width: 24, height: 24, backgroundColor: theme.primaryColor, border: '1px solid #ccc', borderRadius: 4 }} title="Primario" />
                                <div style={{ width: 24, height: 24, backgroundColor: theme.accentColor, border: '1px solid #ccc', borderRadius: 4 }} title="Acento" />
                            </div>
                        </div>
                    ))
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            </Modal.Footer>
        </Modal>
    );
};