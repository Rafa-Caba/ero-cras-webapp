import { forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import type { JSONContent } from '@tiptap/react';

export const TiptapChatEditor = forwardRef(({ content, onChange }: {
    content: JSONContent | null;
    onChange: (c: JSONContent) => void;
}, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false }),
            Heading.configure({ levels: [1, 2] }),
            Underline,
            Placeholder.configure({ placeholder: 'Escribe tu mensaje…' }),
        ],
        content,
        editorProps: {
            attributes: {
                class:
                    'chat-editor border rounded px-3 py-2 min-h-[70px] max-h-[150px] overflow-y-auto box-border bg-white focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    useImperativeHandle(ref, () => ({
        clear: () => {
            editor?.commands.clearContent();
        }
    }));

    if (!editor) return null;

    return (
        <div className="tiptap-chat-wrapper">
            <div className="chat-toolbar mb-1">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>B</button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>I</button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}>U</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>H1</button>
                <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>• Lista</button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''}>1. Lista</button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
});
