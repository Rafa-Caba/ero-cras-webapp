import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import '../../assets/styles/components/_tiptapEditor.scss';
import { customExtensions } from '../../utils/tiptap/extensions';
import type { JSONContent } from '@tiptap/react';

interface Props {
    content: JSONContent;
    onChange: (value: JSONContent) => void;
}

export const TiptapEditor = ({ content, onChange }: Props) => {
    const editor = useEditor({
        extensions: customExtensions,
        content,
        editorProps: {
            attributes: {
                class: 'editor',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        }
    });

    useEffect(() => {
        if (editor && JSON.stringify(content) !== JSON.stringify(editor.getJSON())) {
            try {
                editor.commands.setContent(content);
            } catch (error) {
                console.warn('Contenido inválido en editor:', error);
            }
        }
    }, [content]);

    return (
        <div className='editor-estilo'>
            {editor && (
                <div className="editor-toolbar mb-2">
                    <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>B</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>I</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}>U</button>

                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'active' : ''}>Izq</button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'active' : ''}>Centrado</button>
                    <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'active' : ''}>Der</button>

                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>H1</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>

                    <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>• Lista</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''}>1. Lista</button>
                </div>
            )}
            <EditorContent editor={editor} />
        </div>
    );
};
