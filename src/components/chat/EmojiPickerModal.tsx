import { Modal, Button } from 'react-bootstrap';

const emojis = ['😀', '😂', '😍', '🥳', '😎', '👍', '🙏', '🔥', '💯', '💖', '😢', '🤯'];

interface Props {
    show: boolean;
    onClose: () => void;
    onSelect: (emoji: string) => void;
}

export const EmojiPickerModal = ({ show, onClose, onSelect }: Props) => {

    const handleSelect = (emoji: string) => {
        onSelect(emoji);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Elige un emoji</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {emojis.map((emoji) => (
                        <Button
                            key={emoji}
                            variant="light"
                            className="fs-4 border-0"
                            onClick={() => handleSelect(emoji)}
                        >
                            {emoji}
                        </Button>
                    ))}
                </div>
            </Modal.Body>
        </Modal>
    );
};
