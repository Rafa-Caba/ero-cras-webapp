import { type RefObject } from 'react';
import { Button, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { TiptapChatEditor } from '../tiptap-components/TiptapChatEditor';

interface Props {
    messageContent: any;
    setMessageContent: (msg: any) => void;
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSend: () => void;
    onAttachClick: () => void;

    fileInputRef: RefObject<HTMLInputElement | null>;
    editorRef: RefObject<{ clear: () => void } | null>;
    loading?: boolean;
}

export const ChatInputArea = ({
    messageContent,
    setMessageContent,
    onFileSelect,
    onSend,
    fileInputRef,
    onAttachClick,
    editorRef,
    loading = false
}: Props) => {
    return (
        <>
            <div className="max-h-[150px] overflow-y-auto px-2 py-1 rounded bg-white border border-gray-300 chat-container-color-textarea">
                <TiptapChatEditor ref={editorRef} content={messageContent} onChange={setMessageContent} />
            </div>

            <div className="d-flex align-items-center justify-content-end gap-2 mt-2 flex-wrap">
                <Form.Group className="mb-0">
                    <Button
                        variant="secondary"
                        onClick={onAttachClick}
                        aria-label="Adjuntar archivo"
                        disabled={loading}
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
                    disabled={loading}
                >
                    {loading ? 'Enviando...' : 'Enviar'}
                </Button>
            </div>
        </>
    );
};