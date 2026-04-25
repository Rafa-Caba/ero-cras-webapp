// src/components/tiptap-components/TiptapChatViewer.tsx

import { Box } from '@mui/material';

import { EditorContent, useEditor } from '@tiptap/react';
import type { JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';

interface TiptapChatViewerProps {
    content: JSONContent;
}

export const TiptapChatViewer = ({ content }: TiptapChatViewerProps) => {
    const editor = useEditor({
        editable: false,
        content,
        extensions: [
            StarterKit.configure({ heading: false }),
            Heading.configure({ levels: [1, 2] }),
            Underline,
        ],
        editorProps: {
            attributes: {
                class: 'chat-viewer ProseMirror chat-text-color',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <Box
            sx={{
                width: '100%',
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                '& .ProseMirror': {
                    outline: 'none',
                    color: 'inherit',
                    fontSize: '0.92rem',
                    lineHeight: 1.45,
                },
                '& .ProseMirror p': {
                    m: 0,
                },
                '& .ProseMirror h1': {
                    m: 0,
                    fontSize: '1.25rem',
                    fontWeight: 950,
                    lineHeight: 1.2,
                },
                '& .ProseMirror h2': {
                    m: 0,
                    fontSize: '1.08rem',
                    fontWeight: 950,
                    lineHeight: 1.25,
                },
                '& .ProseMirror ul, & .ProseMirror ol': {
                    my: 0.5,
                    pl: 2.25,
                },
                '& .ProseMirror li': {
                    my: 0.15,
                },
            }}
        >
            <EditorContent editor={editor} />
        </Box>
    );
};