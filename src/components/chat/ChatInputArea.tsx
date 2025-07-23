import { type RefObject } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { TiptapChatEditor } from '../tiptap-components/TiptapChatEditor';
import type { JSONContent } from '@tiptap/react';

interface Props {
    mensaje: JSONContent;
    setMensaje: (msg: JSONContent) => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: () => void;
    onClickAdjuntar: () => void;
    fileInputRef: RefObject<HTMLInputElement | null>;
    editorRef: RefObject<{ clear: () => void } | null>;
    cargando?: boolean;
}

export const ChatInputArea = ({
    mensaje,
    setMensaje,
    onFileSelect,
    onSend,
    fileInputRef,
    onClickAdjuntar,
    editorRef,
    cargando = false
}: Props) => {
    return (
        <>
            <div className="max-h-[150px] overflow-y-auto px-2 py-1 rounded bg-white border border-gray-300 chat-container-color-textarea">
                <TiptapChatEditor ref={editorRef} content={mensaje} onChange={setMensaje} />
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2 mt-2 flex-wrap">
                <Form.Group className="mb-0">
                    <Button
                        variant="secondary"
                        onClick={onClickAdjuntar}
                        aria-label="Adjuntar archivo"
                        disabled={cargando}
                    >
                        <FontAwesomeIcon icon={faPaperclip} className="text-white" size="lg" />
                    </Button>

                    <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.zip,.rar,.mp3,.wav,.mp4,.mov,.webm"
                        ref={fileInputRef}
                        onChange={onFileSelect}
                        style={{ display: 'none' }}
                    />
                </Form.Group>

                <Button
                    className='general_btn px-4'
                    onClick={onSend}
                    disabled={cargando}
                >
                    {cargando ? 'Enviando...' : 'Enviar'}
                </Button>
            </div>
        </>
    );
};
