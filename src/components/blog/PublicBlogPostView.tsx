import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Spinner, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useBlogPostsStore } from '../../store/admin/useBlogPostsStore';
import { usePublicBlogStore } from '../../store/public/usePublicBlogStore';

export const PublicBlogPostView = () => {
    const { id } = useParams<{ id: string }>();
    const {
        postSeleccionado,
        // fetchPostPorId,
        comentarEnPost,
        darLike,
        cargando
    } = useBlogPostsStore();

    const { fetchPublicPostPorId } = usePublicBlogStore();

    const [comentario, setComentario] = useState('');
    const [autorComentario, setAutorComentario] = useState(''); // Puedes usar el AuthContext si tienes auth
    const [likeCargando, setLikeCargando] = useState(false);
    const [comentarioCargando, setComentarioCargando] = useState(false);

    useEffect(() => {
        if (id) {
            fetchPublicPostPorId(id).catch(() => {
                Swal.fire('Error', 'No se pudo cargar el post', 'error');
            });
        }
    }, [id]);

    const handleLike = async () => {
        if (!id || !autorComentario.trim()) {
            Swal.fire('Aviso', 'Ingresa tu nombre antes de dar Like', 'info');
            return;
        }

        try {
            setLikeCargando(true);
            await darLike(id, autorComentario.trim());
            await fetchPublicPostPorId(id); // refrescar post
        } catch (error) {
            Swal.fire('Error', 'No se pudo procesar el Like', 'error');
        } finally {
            setLikeCargando(false);
        }
    };

    const handleComentario = async (e: FormEvent) => {
        e.preventDefault();
        if (!comentario.trim() || !autorComentario.trim()) {
            Swal.fire('Oops', 'Ambos campos son requeridos', 'warning');
            return;
        }

        try {
            setComentarioCargando(true);
            await comentarEnPost(id!, autorComentario.trim(), comentario.trim());
            await fetchPublicPostPorId(id!);
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

    const { titulo, contenido, autor, createdAt, imagenUrl, likes, comentarios, } = postSeleccionado;

    return (
        <div className="container my-4">
            <div className='d-flex justify-content-between align-items-center'>
                <h2 className="mb-3">{titulo}</h2>
                <Link className='btn general_btn' to="/blog_posts">Regresar al Blog</Link>
            </div>
            <p className="text-muted">Por {autor} — {new Date(createdAt!).toLocaleDateString()}</p>
            {imagenUrl && (
                <div className="text-center mb-3">
                    <img src={imagenUrl} alt={titulo} className="img-post rounded" />
                </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: contenido }} />

            <div className="mt-4">
                <Form.Group controlId="autorComentario" className="mb-3">
                    <Form.Label>Tu Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre"
                        value={autorComentario}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setAutorComentario(e.target.value)}
                    />
                </Form.Group>

                <Button
                    className="me-2"
                    variant="primary"
                    onClick={handleLike}
                    disabled={likeCargando}
                >
                    👍 {likeCargando ? 'Cargando...' : `Me gusta (${likes})`}
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
