import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useBlogStore } from '../../store/admin/useBlogStore';

export const AdminBlogPostList = () => {
    const [search, setSearch] = useState('');

    const {
        posts,
        loading,
        fetchPosts,
        removePost,
    } = useBlogStore();

    useEffect(() => {
        fetchPosts();
    }, []);

    // Local filtering
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.author.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el post y su imagen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            await removePost(id);
            Swal.fire('Eliminado', 'El post ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el post', 'error');
        }
    };

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Posts del Blog</h2>
                <div className="botones mb-3">
                    {/* <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link> */}
                    <Link to="/admin/blog/new" className="btn general_btn me-2">Nuevo Post</Link>
                </div>
            </div>

            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Buscar por título o autor"
                    className="form-control mb-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="mb-2">
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <Spinner animation="border" />
                    </div>
                ) : (
                    <>
                        <Table bordered hover responsive className="text-center align-middle mx-auto">
                            <thead className="table-dark">
                                <tr>
                                    <th>Portada</th>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Likes</th>
                                    <th>Comentarios</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.length === 0 ? (
                                    <tr><td colSpan={7}>No se encontraron posts con ese criterio.</td></tr>
                                ) : (
                                    filteredPosts.map(post => (
                                        <tr key={post.id}>
                                            <td>
                                                <Image
                                                    src={post.imageUrl || '/images/default-post.jpg'}
                                                    rounded
                                                    height={50}
                                                    width={75}
                                                    style={{ objectFit: 'cover' }}
                                                    alt={post.title}
                                                />
                                            </td>
                                            <td>{post.title}</td>
                                            <td>{post.author?.name || 'Desconocido'}</td>
                                            <td>{post.likes}</td>
                                            <td>{post.comments?.length || 0}</td>
                                            <td>{post.isPublic ? '✅' : '❌'}</td>
                                            <td>
                                                <Link to={`/admin/blog/edit/${post.id}`} className="btn general_btn mb-2 mb-md-0 me-2">Editar</Link>
                                                <Button variant="danger" onClick={() => handleDelete(post.id)}>
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </>
                )}
            </div>
        </div>
    );
};