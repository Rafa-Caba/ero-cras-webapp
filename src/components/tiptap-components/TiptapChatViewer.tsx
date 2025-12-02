import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Heading from '@tiptap/extension-heading';
import type { JSONContent } from '@tiptap/react';

export const TiptapChatViewer = ({ content }: { content: JSONContent }) => {
    const editor = useEditor({
        editable: false,
        content,
        extensions: [
            StarterKit.configure({ heading: false }),
            Heading.configure({ levels: [1, 2] }),
            Underline
        ],
        editorProps: {
            attributes: {
                class: 'chat-viewer ProseMirror chat-text-color',
            },
        },
    });

    if (!editor) return null;

    return <EditorContent editor={editor} />;
};
