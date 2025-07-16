import { useEffect, useState } from 'react';
import { Card, Spinner, Button, Modal, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAvisosStore } from '../../store/admin/useAvisosStore';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { getTextFromTipTapJSON } from '../../utils/handleTextTipTap';

export const AvisosSidebar = () => {
    const navigate = useNavigate();
    const { avisos, fetchAvisos, cargando } = useAvisosStore();
    const [avisoActivo, setAvisoActivo] = useState<typeof avisos[0] | null>(null);

    useEffect(() => {
        fetchAvisos(1, 3); // Solo 3 avisos para mostrar en el sidebar
    }, []);

    const modalNavigate = () => {
        setAvisoActivo(null);
        navigate('/admin/announcements');
    }

    return (
        <div className="px-2 py-3">
            <h4 className="text-center fw-bold mb-3">📰 Avisos</h4>

            {cargando ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" size="sm" />
                </div>
            ) : (
                avisos
                    .filter(aviso => aviso.publicado)
                    .slice(0, 3)
                    .map((aviso) => (
                        <Card
                            key={aviso._id}
                            className="mb-3 shadow-sm border-0"
                            style={{ backgroundColor: '#f5e1ff', fontSize: '0.9rem' }}
                        >
                            <Card.Body className="aviso-sidebar p-2">
                                <Card.Title
                                    className="mb-1 text-truncate text-theme-color"
                                    title={aviso.titulo}
                                >
                                    📌 {aviso.titulo}
                                </Card.Title>

                                <Card.Text className="mb-1 small text-theme-color">
                                    {new Date(aviso.createdAt!).toLocaleDateString()}
                                </Card.Text>

                                <Card.Text className="small text-secondary mb-1">
                                    {getTextFromTipTapJSON(aviso.contenido, 80)}...
                                </Card.Text>

                                <Button
                                    variant="link"
                                    className="p-0 small text-decoration-none text-theme-color"
                                    onClick={() => setAvisoActivo(aviso)}
                                >
                                    Ver más →
                                </Button>
                            </Card.Body>
                        </Card>
                    ))
            )}

            {/* Modal de aviso activo */}
            <Modal show={!!avisoActivo} onHide={() => setAvisoActivo(null)} centered size="lg">
                <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center w-100 justify-content-between">
                        <Modal.Title className="me-auto">{avisoActivo?.titulo}</Modal.Title>
                        {avisoActivo?.imagenUrl && (
                            <Image
                                src={avisoActivo.imagenUrl}
                                alt="imagen aviso"
                                width={40}
                                height={40}
                                roundedCircle
                                className="mx-2 border border-light"
                            />
                        )}
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <TiptapViewer content={avisoActivo?.contenido || emptyEditorContent} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setAvisoActivo(null)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={modalNavigate}>
                        Ir a la página de avisos
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
