import { Modal } from 'react-bootstrap';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';

interface Props {
    show: boolean;
    onClose: () => void;
    onSelect: (emoji: string) => void;
}

export const EmojiPickerModal = ({ show, onClose, onSelect }: Props) => {
    const handleEmojiClick = (emojiData: EmojiClickData) => {
        onSelect(emojiData.emoji);
        onClose();
    };

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Selecciona un emoji</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center">
                    <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        width="100%"
                        height={400}
                        lazyLoadEmojis={true}
                        skinTonesDisabled={false}
                        searchDisabled={false}
                        previewConfig={{ showPreview: false }}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};
