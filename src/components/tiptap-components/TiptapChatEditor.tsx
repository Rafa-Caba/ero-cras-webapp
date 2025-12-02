import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import Heading from '@tiptap/extension-heading';
import EmojiPicker, { type EmojiClickData } from 'emoji-picker-react';
import type { JSONContent } from '@tiptap/react';
import { Button } from 'react-bootstrap';

export const TiptapChatEditor = forwardRef(({ content, onChange }: {
    content: JSONContent | null;
    onChange: (c: JSONContent) => void;
}, ref) => {
    const [showEmojis, setShowEmojis] = useState(false);
    const emojiRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false }),
            Heading.configure({ levels: [1, 2] }),
            Underline,
            Placeholder.configure({ placeholder: 'Escribe tu mensaje…' }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class:
                    'chat-editor border chat-container-color-textarea-text rounded px-3 py-2 min-h-[70px] max-h-[150px] overflow-y-auto box-border bg-white focus:outline-none',
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON());
        },
    });

    useEffect(() => {
        if (editor && content) {
            const currentContent = editor.getJSON();
            if (JSON.stringify(currentContent) !== JSON.stringify(content)) {
                editor.commands.setContent(content);
            }
        } else if (editor && content === null) {
            editor.commands.clearContent();
        }
    }, [content, editor]);


    const handleEmojiClick = (emojiData: EmojiClickData) => {
        editor?.chain().focus().insertContent(emojiData.emoji).run();
        setShowEmojis(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                setShowEmojis(false);
            }
        };

        if (showEmojis) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojis]);

    useImperativeHandle(ref, () => ({
        clear: () => {
            editor?.commands.clearContent();
        }
    }));

    if (!editor) return null;

    return (
        <div className="tiptap-chat-wrapper">
            <div className='d-flex justify-content-between'>
                <div className="chat-toolbar mb-1 chat-container-color-textarea">
                    <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}>B</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}>I</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}>U</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}>H1</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>H2</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'active' : ''}>• Lista</button>
                    <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'active' : ''}>1. Lista</button>
                </div>
                <div className='chat-toolbar mb-1 chat-container-color-textarea'>
                    {showEmojis && (
                        <div ref={emojiRef} className="emoji-container mt-1" style={{ position: 'absolute', zIndex: 10, bottom: '100%', right: 0 }}>
                            <EmojiPicker onEmojiClick={handleEmojiClick} height={350} width={300} />
                        </div>
                    )}
                    <Button
                        variant={showEmojis ? 'primary' : 'secondary'}
                        onClick={() => setShowEmojis((prev) => !prev)}
                        style={{ marginTop: 6 }}
                        title="Insert emoji"
                        size="sm"
                    >
                        😊
                    </Button>
                </div>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
});