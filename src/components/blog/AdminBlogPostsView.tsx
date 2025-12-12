import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Spinner, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import { useBlogStore } from '../../store/admin/useBlogStore';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import { parseText } from '../../utils/handleTextTipTap';

export const AdminBlogPostsView = () => {
    const {
        posts,
        loading,
        fetchPosts,
    } = useBlogStore();

    useEffect(() => {
        fetchPosts().catch(() => {
            Swal.fire('Error', 'No se pudo cargar el post', 'error');
        });
    }, []);

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    if (loading) return <div className="text-center mt-4"><Spinner animation="border" /></div>;

    return (
        <section className="container py-4">
            <div className="botones text-center mb-3">
                <h2 className="mb-4">Publicaciones</h2>
                {/* <Link to="/admin" className="btn general_btn mb-4">Ir al Panel de Control</Link> */}
            </div>
            {
                posts.length === 0 ? (
                    <p>No hay publicaciones disponibles.</p>
                ) : (
                    <Masonry
                        breakpointCols={{ default: 4, 1100: 3, 768: 2, 500: 1 }}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {[...posts].filter(post => post.isPublic).reverse().map((post) => (
                            <motion.div
                                className="masonry-item card post-card fade-in"
                                key={post.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                            >
                                <Card className="h-100 shadow-sm border-0">
                                    {post.imageUrl && (
                                        <Card.Img className="img-posts" variant="top" src={post.imageUrl} alt={post.title} />
                                    )}
                                    <Card.Body className="d-flex flex-column">
                                        <Card.Title className="fw-bold">{post.title}</Card.Title>

                                        <Card.Subtitle className="mb-3 text-muted small">
                                            Por {post.author?.name || 'Desconocido'}
                                        </Card.Subtitle>

                                        <Card.Text as="div" className="flex-grow-1 text-truncate-container">
                                            {post.content && <TiptapViewer content={parseText(post.content) as any} />}
                                        </Card.Text>

                                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                            <div className="d-flex gap-3 text-muted small">
                                                <span title="Likes">
                                                    ❤️ {post.likes || 0}
                                                </span>
                                                <span title="Comentarios">
                                                    💬 {post.comments?.length || 0}
                                                </span>
                                            </div>

                                            <Link to={`/admin/blog/view/${post.id}`}>
                                                <Button size="sm" className="btn general_btn">Leer más</Button>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        ))}
                    </Masonry>
                )
            }
        </section >
    );
};