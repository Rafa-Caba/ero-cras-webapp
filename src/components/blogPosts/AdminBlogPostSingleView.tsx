import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useBlogPostsStore } from '../../store/admin/useBlogPostsStore';
import { useAuth } from '../../hooks/useAuth';

export const AdminBlogPostSingleView = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const {
        postSeleccionado,
        fetchPostPorId,
        comentarEnPost,
        darLike,
        cargando
    } = useBlogPostsStore();

    const [comentario, setComentario] = useState('');
    const [likeCargando, setLikeCargando] = useState(false);
    const [comentarioCargando, setComentarioCargando] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPostPorId(id).catch(() => {
                Swal.fire('Error', 'No se pudo cargar el post', 'error');
            });
        }
    }, [id]);

    const handleLike = async () => {
        if (!id || !user?.nombre) {
            Swal.fire('Aviso', 'Debes iniciar sesión para dar Like', 'info');
            return;
        }

        try {
            setLikeCargando(true);
            await darLike(id, user._id);
            await fetchPostPorId(id); // refrescar post
        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar el Like', 'error');
        } finally {
            setLikeCargando(false);
        }
    };

    const handleComentario = async (e: FormEvent) => {
        e.preventDefault();
        if (!comentario.trim()) {
            Swal.fire('Oops', 'El comentario no puede estar vacío', 'warning');
            return;
        }

        if (!user?.nombre) {
            Swal.fire('Aviso', 'Debes iniciar sesión para comentar', 'info');
            return;
        }

        try {
            setComentarioCargando(true);
            await comentarEnPost(id!, user.nombre, comentario.trim());
            await fetchPostPorId(id!);
            setComentario('');
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar el comentario', 'error');
        } finally {
            setComentarioCargando(false);
        }
    };

    if (cargando || !postSeleccionado) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    const { titulo, contenido, autor, createdAt, imagenUrl, likes, comentarios, likesUsuarios } = postSeleccionado;

    return (
        <div className="container my-4">
            <div className='d-flex justify-content-between align-items-center'>
                <h2 className="mb-3">{titulo}</h2>
                <Link className='btn general_btn' to="/admin/blog_posts">Regresar al Blog</Link>
            </div>
            <p className="text-muted">Por {autor} — {new Date(createdAt!).toLocaleDateString()}</p>
            {imagenUrl && (
                <div className="text-center mb-4">
                    <img src={imagenUrl} alt={titulo} className="img-post rounded" />
                </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: contenido }} />

            <div className="mt-4">
                <Button
                    className="me-2"
                    style={{
                        backgroundColor: likesUsuarios.includes(user?._id || '') ? '#7d2181' : undefined,
                        borderColor: likesUsuarios.includes(user?._id || '') ? '#7d2181' : undefined
                    }}
                    onClick={handleLike}
                    disabled={likeCargando}
                >
                    {likeCargando
                        ? 'Cargando...'
                        : likesUsuarios.includes(user?._id || '')
                            ? `❤️ Remover me gusta (${likes})`
                            : `🤍 Me gusta (${likes})`
                    }
                </Button>
            </div>

            <hr />

            <div className="comentarios mt-4">
                <h4>Comentarios ({comentarios.length})</h4>

                <Form onSubmit={handleComentario} className="mb-4">
                    <Form.Group controlId="comentarioTexto" className="mb-3">
                        <Form.Label>Comentario</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Escribe tu comentario..."
                            value={comentario}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComentario(e.target.value)}
                        />
                    </Form.Group>

                    <Button type="submit" variant="success" disabled={comentarioCargando}>
                        {comentarioCargando ? 'Enviando...' : 'Comentar'}
                    </Button>
                </Form>

                {comentarios.length > 0 ? (
                    comentarios.map((c, i) => (
                        <div key={i} className="border p-2 rounded mb-2">
                            <p className="mb-1"><strong>{c.autor}</strong> — <small>{new Date(c.fecha).toLocaleString()}</small></p>
                            <p className="mb-0">{c.texto}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay comentarios aún.</p>
                )}
            </div>
        </div>
    );
};