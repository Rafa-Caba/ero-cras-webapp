import { Modal, Button, Accordion } from "react-bootstrap";
import type { Canto } from "../types";
import { TiptapViewer } from "../components/tiptap-components/TiptapViewer";

interface CantosProps {
    show: boolean;
    onHide: () => void;
    tipoDeCanto: string;
    cantos: Canto[];
}

export const CantoModal = ({ show, onHide, tipoDeCanto, cantos }: CantosProps) => {
    return (
        <Modal show={show} onHide={onHide} scrollable>
            <Modal.Header closeButton className="modal-bg-color">
                <Modal.Title>{tipoDeCanto}</Modal.Title>
            </Modal.Header>

            <Modal.Body className="modal-bg-color">
                <Accordion alwaysOpen className="accordion-custom">
                    {cantos.map((canto) => (
                        <Accordion.Item eventKey={String(canto._id)} key={canto._id}>
                            <Accordion.Header>{canto.titulo}</Accordion.Header>
                            <Accordion.Body>
                                <p className="fw-bold fs-4">- {canto.titulo} -</p>

                                <TiptapViewer content={canto.texto} />

                                <p className="fst-italic mt-3">
                                    {canto.tipo} - {canto.compositor}
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
