// src/components/chat/ChatInputArea.tsx

import { type RefObject } from 'react';
import type { JSONContent } from '@tiptap/react';

import {
    Box,
    Button,
    IconButton,
    Paper,
} from '@mui/material';

import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';

import { TiptapChatEditor } from '../tiptap-components/TiptapChatEditor';

interface Props {
    messageContent: JSONContent;
    setMessageContent: (message: JSONContent) => void;
    onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
    loading = false,
}: Props) => {
    return (
        <Paper
            elevation={0}
            sx={{
                flexShrink: 0,
                p: {
                    xs: 1,
                    md: 1.25,
                },
                borderRadius: 1.5,
                backgroundColor:
                    'color-mix(in srgb, var(--color-card) 84%, var(--color-primary) 16%)',
                border: '1px solid color-mix(in srgb, var(--color-border) 34%, transparent)',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                overflow: 'visible',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    minWidth: 0,
                    overflow: 'visible',
                    '& .ProseMirror': {
                        outline: 'none',
                        color: 'var(--color-text)',
                    },
                }}
            >
                <TiptapChatEditor
                    ref={editorRef}
                    content={messageContent}
                    onChange={setMessageContent}
                />
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: 1,
                    flexWrap: 'wrap',
                }}
            >
                <IconButton
                    aria-label="Adjuntar archivo"
                    onClick={onAttachClick}
                    disabled={loading}
                    sx={{
                        color: 'var(--color-button-text)',
                        backgroundColor: 'var(--color-secondary)',
                        '&:hover': {
                            backgroundColor:
                                'color-mix(in srgb, var(--color-secondary) 85%, #000 15%)',
                        },
                    }}
                >
                    <AttachFileRoundedIcon />
                </IconButton>

                <input
                    hidden
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.zip,.rar,.mp3,.wav,.mp4,.mov,.webm"
                    ref={fileInputRef}
                    onChange={onFileSelect}
                />

                <Button
                    variant="contained"
                    endIcon={<SendRoundedIcon />}
                    onClick={onSend}
                    disabled={loading}
                    sx={{
                        borderRadius: 1.5,
                        px: 2.5,
                        fontWeight: 950,
                    }}
                >
                    {loading ? 'Enviando...' : 'Enviar'}
                </Button>
            </Box>
        </Paper>
    );
};