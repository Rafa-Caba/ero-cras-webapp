import { useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAvisosStore } from '../../store/admin/useAvisosStore';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';

export const AvisosSidebar = () => {
    const { avisos, fetchAvisos, cargando } = useAvisosStore();

    useEffect(() => {
        fetchAvisos(1, 3); // Solo 3 avisos para mostrar en el sidebar
    }, []);

    return (
        <div className="px-2 py-3">
            <h4 className="text-center fw-bold mb-3">📰 Avisos</h4>

            {cargando ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" size="sm" />
                </div>
            ) : (
                avisos.slice(0, 3).map((aviso) => (
                    <Card
                        key={aviso._id}
                        className="mb-3 shadow-sm border-0"
                        style={{ backgroundColor: '#f5e1ff', fontSize: '0.9rem' }}
                    >
                        <Card.Body className="aviso-sidebar p-2">
                            <Card.Title className="mb-1 text-truncate text-theme-color" title={aviso.titulo}>
                                📌 {aviso.titulo}
                            </Card.Title>
                            <Card.Text className="mb-1 small text-theme-color">
                                {new Date(aviso.createdAt!).toLocaleDateString()}
                            </Card.Text>

                            <TiptapViewer content={aviso.contenido} />...

                            <Link to="/admin/announcements" className="small text-decoration-none text-theme-color">
                                Ver más →
                            </Link>
                        </Card.Body>
                    </Card>
                ))
            )}
        </div>
    );
};
