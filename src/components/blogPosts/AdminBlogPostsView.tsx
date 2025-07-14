import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Spinner, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import { useBlogPostsStore } from '../../store/admin/useBlogPostsStore';

export const AdminBlogPostsView = () => {
    const {
        posts,
        cargando,
        error,
        fetchPosts,
    } = useBlogPostsStore();

    useEffect(() => {
        fetchPosts().catch(() => {
            Swal.fire('Error', 'No se pudo cargar el post', 'error');
        });
    }, []);

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    if (cargando) return <div className="text-center mt-4"><Spinner animation="border" /></div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <section className="container py-4">
            <div className="botones text-center mb-3">
                <h2 className="mb-4">Publicaciones</h2>
                <Link to="/admin" className="btn general_btn mb-4">Ir al Panel de Control</Link>
            </div>
            {posts.length === 0 ? (
                <p>No hay publicaciones disponibles.</p>
            ) : (
                <Masonry
                    breakpointCols={{ default: 4, 1100: 3, 768: 2, 500: 1 }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {[...posts].reverse().map((post) => (
                        <motion.div
                            className="masonry-item card post-card fade-in"
                            key={post._id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <Card>
                                {post.imagenUrl && (
                                    <Card.Img className="img-posts" variant="top" src={post.imagenUrl} alt={post.titulo} />
                                )}
                                <Card.Body>
                                    <Card.Title>{post.titulo}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">Por {post.autor}</Card.Subtitle>
                                    <Card.Text>
                                        {post.contenido ? `${post.contenido.slice(0, 120)}...` : 'Sin contenido'}
                                    </Card.Text>
                                    <Link to={`/admin/blog_posts/${post._id}`}>
                                        <Button className="btn general_btn">Leer más</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </motion.div>
                    ))}
                </Masonry>
                // <div className="row">
                //     {posts.map((post) => (
                //         <div className="col-md-3 mb-4" key={post._id}>
                //             <Card className="img-posts-container card-post">
                //                 {post.imagenUrl && (
                //                     <Card.Img
                //                         className="img-posts"
                //                         variant="top"
                //                         src={post.imagenUrl}
                //                         alt={post.titulo}
                //                     />
                //                 )}
                //                 <Card.Body className="card-body-post">
                //                     <div>
                //                         <Card.Title>{post.titulo}</Card.Title>
                //                         <Card.Subtitle className="mb-2 text-muted">Por {post.autor}</Card.Subtitle>
                //                         <Card.Text>
                //                             {post.contenido ? `${post.contenido.slice(0, 120)}...` : 'Sin contenido'}
                //                         </Card.Text>
                //                     </div>
                //                     <Link to={`/admin/blog_posts/${post._id}`}>
                //                         <Button className="btn general_btn mt-2">Leer más</Button>
                //                     </Link>
                //                 </Card.Body>
                //             </Card>
                //         </div>
                //     ))}
                // </div>
            )
            }
        </section >
    );
};
