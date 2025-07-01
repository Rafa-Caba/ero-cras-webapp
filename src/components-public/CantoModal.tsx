import { Modal, Button, Accordion } from "react-bootstrap";
import type { Canto } from "../types";

interface CantosProps {
    show: boolean;
    onHide: () => void;
    tipoDeCanto: string;
    cantos: Canto[];
}

const CantoModal = ({ show, onHide, tipoDeCanto, cantos }: CantosProps) => {
    const cantosFiltrados = cantos.filter(canto => canto.tipo === tipoDeCanto);

    return (
        <Modal show={show} onHide={onHide} scrollable>
            <Modal.Header closeButton>
                <Modal.Title>{tipoDeCanto}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Accordion alwaysOpen>
                    {cantosFiltrados.map((canto) => (
                        <Accordion.Item eventKey={String(canto._id)} key={canto._id}>
                            <Accordion.Header>{canto.titulo}</Accordion.Header>
                            <Accordion.Body>
                                <p className="fw-bold fs-4">- {canto.titulo} -</p>
                                {canto.texto.split("\n").map((line, i) => (
                                    <span key={i}>{line}<br /></span>
                                ))}
                                <p className="fst-italic">
                                    {canto.tipo} - {canto.compositor}
                                </p>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CantoModal;
