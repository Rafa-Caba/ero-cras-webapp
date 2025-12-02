// import { useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Card, Spinner, Button } from 'react-bootstrap';
// import Swal from 'sweetalert2';
// import { usePublicBlogStore } from '../../store/public/usePublicBlogStore';

// export const PublicBlogPostsView = () => {
//     const {
//         posts,
//         cargando,
//         error,
//         fetchPublicPosts,
//     } = usePublicBlogStore();

//     useEffect(() => {
//         fetchPublicPosts().catch(() => {
//             Swal.fire('Error', 'No se pudo cargar el post', 'error');
//         });
//     }, []);

//     if (cargando) return <div className="text-center mt-4"><Spinner animation="border" /></div>;
//     if (error) return <div className="alert alert-danger">{error}</div>;

//     return (
//         <section className="container py-4">
//             <h2 className="mb-4">Publicaciones</h2>
//             {posts.length === 0 ? (
//                 <p>No hay publicaciones disponibles.</p>
//             ) : (
//                 <div className="row">
//                     {posts.map((post) => (
//                         <div className="col-md-4 mb-4" key={post._id}>
//                             <Card>
//                                 {post.imagenUrl && <Card.Img className='img-post' variant="top" src={post.imagenUrl} alt={post.titulo} />}
//                                 <Card.Body>
//                                     <Card.Title>{post.titulo}</Card.Title>
//                                     <Card.Subtitle className="mb-2 text-muted">Por {post.autor}</Card.Subtitle>
//                                     <Card.Text>
//                                         {post.contenido ? `${post.contenido.slice(0, 120)}...` : 'Sin contenido'}
//                                     </Card.Text>
//                                     <Link to={`/blog_posts/${post._id}`}>
//                                         <Button className='btn general_btn'>Leer más</Button>
//                                     </Link>
//                                 </Card.Body>
//                             </Card>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </section>
//     );
// };
