import { useEditor, EditorContent } from '@tiptap/react';
import { customExtensions } from '../../utils/tiptap/extensions';
import type { JSONContent } from '@tiptap/react';
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

    if (!editor) return null;

    return (
        <div className="tiptap-viewer">
            <EditorContent editor={editor} />
        </div>
    );
};
