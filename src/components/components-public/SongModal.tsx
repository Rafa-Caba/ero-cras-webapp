import { Modal, Button, Accordion } from "react-bootstrap";
import type { Song } from "../../types/song";
import { TiptapViewer } from "../tiptap-components/TiptapViewer";
import { parseText } from "../../utils/handleTextTipTap";

interface SongModalProps {
    show: boolean;
    onHide: () => void;
    categoryName: string;
    songs: Song[];
}

export const SongModal = ({ show, onHide, categoryName, songs }: SongModalProps) => {
    return (
        <Modal show={show} onHide={onHide} scrollable enforceFocus={false}>
            <Modal.Header closeButton className="modal-bg-color">
                <Modal.Title>{categoryName}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-bg-color">
                <Accordion alwaysOpen className="accordion-custom">
                    {songs.map((song) => (
                        <Accordion.Item eventKey={String(song.id)} key={song.id}>
                            <Accordion.Header>{song.title}</Accordion.Header>
                            <Accordion.Body>
                                <p className="fw-bold fs-4">- {song.title} -</p>

                                <TiptapViewer content={parseText(song.content)} />

                                <p className="fst-italic mt-3">
                                    {song.songTypeName} - {song.composer}
                                </p>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Modal.Body>

            <Modal.Footer className="modal-bg-color">
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};