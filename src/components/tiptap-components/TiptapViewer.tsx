// src/components/tiptap-components/TiptapViewer.tsx

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { EditorContent, useEditor, type JSONContent } from '@tiptap/react';

import { customExtensions } from '../../utils/tiptap/extensions';
import { parseText } from '../../utils/handleTextTipTap';

interface Props {
    content: JSONContent | string;
}

export const TiptapViewer = ({ content }: Props) => {
    const parsedContent = parseText(content);

    const editor = useEditor({
        extensions: customExtensions,
        content: parsedContent,
        editable: false,
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        editor.commands.setContent(parsedContent);
    }, [editor, parsedContent]);

    if (!editor) {
        return null;
    }

    return (
        <Box
            className="tiptap-viewer"
            sx={{
                color: 'var(--color-text)',
                '& .ProseMirror': {
                    outline: 'none',
                },
                '& p': {
                    marginTop: 0,
                    marginBottom: '0.75rem',
                },
            }}
        >
            <EditorContent editor={editor} />
        </Box>
    );
};