import { Modal, Button } from 'react-bootstrap';

interface Props {
    imagenUrl: string | null;
    onClose: () => void;
}

export const ChatImageModal = ({ imagenUrl, onClose }: Props) => {
    return (
        <Modal show={!!imagenUrl} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Imagen del mensaje</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center">
                {imagenUrl && (
                    <img
                        src={imagenUrl}
                        alt="Imagen ampliada"
                        className="img-fluid rounded"
                        style={{ maxHeight: '80vh' }}
                    />
                )}
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
                {imagenUrl && (
                    <a
                        href={imagenUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                    >
                        Descargar
                    </a>
                )}
            </Modal.Footer>
        </Modal>
    );
};
