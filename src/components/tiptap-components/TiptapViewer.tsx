// src/components/tiptap-components/TiptapViewer.tsx

import { useEffect } from 'react';
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
        <div className="tiptap-viewer">
            <EditorContent editor={editor} />
        </div>
    );
};