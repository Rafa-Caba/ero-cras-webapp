import { useEffect, useState } from 'react';
import { Card, Spinner, Button, Modal, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAnnouncementStore } from '../../store/admin/useAnnouncementStore';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import { getTextFromTipTapJSON } from '../../utils/handleTextTipTap';
import type { Announcement } from '../../types/annoucement';
import { useAuth } from '../../context/AuthContext';

export const AvisosSidebar = () => {
    const navigate = useNavigate();
    const { canEdit } = useAuth();
    const { announcements, fetchAnnouncements, loading } = useAnnouncementStore();

    const width = useWindowWidth();
    const isDesktop = width > 780;
    const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null);


    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const modalNavigate = () => {
        setActiveAnnouncement(null);
        navigate('/admin/announcements');
    }

    return (
        <div className={isDesktop ? "px-2 py-3" : "px-2 py-1"}>
            <h4 className="text-center fw-bold mb-3 mt-md-5">📰 Avisos</h4>

            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" size="sm" />
                </div>
            ) : (
                announcements
                    .filter(a => a.isPublic)
                    .slice(0, isDesktop ? 3 : 1)
                    .map((announcement) => (
                        <Card
                            key={announcement.id}
                            className="mb-3 shadow-sm border-0"
                            style={{ backgroundColor: '#f5e1ff', fontSize: '0.9rem' }}
                        >
                            <Card.Body className="aviso-sidebar p-2">
                                <Card.Title
                                    className="mb-1 text-truncate text-theme-color"
                                    title={announcement.title}
                                >
                                    📌 {announcement.title}
                                </Card.Title>

                                <Card.Text className="mb-1 small text-theme-color">
                                    {new Date(announcement.createdAt!).toLocaleDateString()}
                                </Card.Text>

                                {isDesktop &&
                                    <Card.Text className="small text-secondary mb-1">
                                        {getTextFromTipTapJSON(announcement.content, 80)}...
                                    </Card.Text>
                                }

                                <Button
                                    variant="link"
                                    className="p-0 small text-decoration-none text-theme-color"
                                    style={{ color: 'purple', fontWeight: 'bold' }}
                                    onClick={() => setActiveAnnouncement(announcement)}
                                >
                                    Ver más →
                                </Button>
                            </Card.Body>
                        </Card>
                    ))
            )}

            {/* Active Announcement Modal */}
            <Modal show={!!activeAnnouncement} onHide={() => setActiveAnnouncement(null)} centered size="lg">
                <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center w-100 justify-content-center">
                        <Modal.Title className="ms-3">{activeAnnouncement?.title}</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    {activeAnnouncement?.imageUrl && (
                        <Image
                            src={activeAnnouncement.imageUrl}
                            alt="imagen aviso"
                            width={150}
                            height={150}
                            roundedCircle
                            className="border border-light mb-3"
                        />
                    )}
                    <TiptapViewer content={activeAnnouncement?.content || emptyEditorContent} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='px-3' style={{ borderRadius: 10 }} onClick={() => setActiveAnnouncement(null)}>
                        Cerrar
                    </Button>
                    {canEdit &&
                        <Button variant="primary" className='general_btn' onClick={modalNavigate}>
                            Ir a la página de avisos
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    );
};