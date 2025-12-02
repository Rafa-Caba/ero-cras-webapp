import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner, Button, Form } from 'react-bootstrap';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import Swal from 'sweetalert2';
import type { JSONContent } from '@tiptap/react';
import { TiptapEditor } from '../tiptap-components/TiptapEditor';
import { useBlogStore } from '../../store/admin/useBlogStore';
import { createHandleTextoChange, parseText } from '../../utils/handleTextTipTap';
import { emptyEditorContent } from '../../utils/editorDefaults';
import { useAuth } from '../../context/AuthContext';
import { BlogLikeButton } from './BlogLikeButton';

export const AdminBlogPostSingleView = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const {
        currentPost,
        getPost,
        addComment,
        loading
    } = useBlogStore();

    const [commentContent, setCommentContent] = useState<{ texto: JSONContent } | null>({
        texto: { type: 'doc', content: [] }
    });
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        if (id) {
            getPost(id).catch(() => {
                Swal.fire('Error', 'No se pudo cargar el post', 'error');
            });
        }
    }, [id]);

    const handleComment = async (e: FormEvent) => {
        e.preventDefault();

        const hasContent = commentContent?.texto?.content?.some((block: any) =>
            block.content?.some((child: any) => child.text?.trim())
        );

        if (!hasContent) {
            Swal.fire('Oops', 'El comentario no puede estar vacío', 'warning');
            return;
        }

        if (!user?.id) {
            Swal.fire('Aviso', 'Debes iniciar sesión para comentar', 'info');
            return;
        }

        try {
            setCommentLoading(true);
            await addComment(id!, commentContent!.texto);
            setCommentContent(null);
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar el comentario', 'error');
        } finally {
            setCommentLoading(false);
        }
    };

    if (loading || !currentPost) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    const { title, content, author, createdAt, imageUrl, likes, comments, likesUsers } = currentPost;

    return (
        <div className="container my-4">
            <div className='d-flex justify-content-between align-items-center'>
                <h2 className="mb-3">{title}</h2>
                <Link className='btn general_btn' to="/admin/blog/view">Regresar al Blog</Link>
            </div>

            <p className="text-muted">
                Por {author?.name || 'Desconocido'} — {new Date(createdAt!).toLocaleDateString()}
            </p>

            {imageUrl && (
                <div className="text-center mb-4">
                    <img src={imageUrl} alt={title} className="img-post rounded" />
                </div>
            )}

            <TiptapViewer content={parseText(content) as any} />

            <div className="mt-4">
                <BlogLikeButton
                    postId={id!}
                    initialLikes={likes}
                    initialLikesUsers={likesUsers}
                    currentUserId={user?.id}
                />
            </div>

            <hr />

            <div className="comentarios p-2 p-md-3 mt-4">
                <h4>Comentarios ({comments.length})</h4>

                <Form onSubmit={handleComment} className="mb-4">
                    <Form.Group className="mb-3">
                        <Form.Label>Comentario</Form.Label>
                        <TiptapEditor
                            content={commentContent?.texto ?? emptyEditorContent}
                            onChange={createHandleTextoChange(setCommentContent, 'texto')}
                        />
                    </Form.Group>


                    <Button type="submit" variant="success" disabled={commentLoading}>
                        {commentLoading ? 'Enviando...' : 'Comentar'}
                    </Button>
                </Form>

                {comments.length > 0 ? (
                    [...comments].reverse().map((c, i) => (
                        <div key={i}>
                            <div className="border p-0 rounded mb-2">
                                <p className="mb-1"><strong>{c.author}</strong> — <small>{new Date(c.date).toLocaleString()}</small></p>

                                <TiptapViewer content={parseText(c.text) as any} />
                            </div>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>No hay comentarios aún.</p>
                )}
            </div>
        </div>
    );
};