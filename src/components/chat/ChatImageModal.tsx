import { Modal, Button } from 'react-bootstrap';

interface Props {
    imageUrl: string | null;
    onClose: () => void;
}

export const ChatImageModal = ({ imageUrl, onClose }: Props) => {
    return (
        <Modal show={!!imageUrl} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Imagen del mensaje</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt="Imagen ampliada"
                        className="img-fluid rounded"
                        style={{ maxHeight: '80vh' }}
                    />
                )}
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <Button variant="secondary" className='px-3' onClick={onClose}>
                    Cerrar
                </Button>
                {imageUrl && (
                    <a
                        href={imageUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn general_btn"
                    >
                        Descargar
                    </a>
                )}
            </Modal.Footer>
        </Modal>
    );
};