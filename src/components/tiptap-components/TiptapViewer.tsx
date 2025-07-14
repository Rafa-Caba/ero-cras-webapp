import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const TiptapViewer = ({ content }: { content: any }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        editable: false
    });

    if (!editor) return null;

    return <EditorContent editor={editor} />;
};
