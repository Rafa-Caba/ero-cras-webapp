import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Image, Button, Spinner } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useBlogPostsStore } from '../../store/admin/useBlogPostsStore';

export const AdminBlogPosts = () => {
    const [busqueda, setBusqueda] = useState('');
    const {
        posts,
        paginaActual,
        totalPaginas,
        cargando,
        fetchPosts,
        eliminarPostPorId,
        setPaginaActual,
        buscarPostsPorTexto
    } = useBlogPostsStore();

    useEffect(() => {
        fetchPosts(paginaActual);
    }, [paginaActual]);

    const handlePagina = (nuevaPagina: number) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setPaginaActual(nuevaPagina);
        }
    };

    const deletePost = async (id: string) => {
        const confirmar = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el post y su imagen de imagen',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmar.isConfirmed) return;

        try {
            await eliminarPostPorId(id);
            Swal.fire('Eliminado', 'El post ha sido eliminado.', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo eliminar el post', 'error');
        }
    };

    useEffect(() => {
        if (busqueda.trim() === '') {
            fetchPosts(); // si está vacío, traer todos
        } else {
            const delay = setTimeout(() => {
                buscarPostsPorTexto(busqueda);
            }, 500);

            return () => clearTimeout(delay);
        }
    }, [busqueda]);

    return (
        <div className="table-responsive">
            <div className="d-flex flex-column align-items-center my-1">
                <h2 className="mb-4">Posts del Blog</h2>
                <div className="botones mb-3">
                    <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link>
                    <Link to="/admin/blogposts/new_blogpost" className="btn general_btn me-2">Nuevo Post</Link>
                </div>
            </div>

            <div className="mb-2">
                <input
                    type="text"
                    placeholder="Buscar por título o contenido"
                    className="form-control mb-2"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div className="mb-2">
                {cargando ? (
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
                                {posts.length === 0 ? (
                                    <tr><td colSpan={7}>No se encontraron posts con ese criterio.</td></tr>
                                ) : (
                                    posts.map(post => (
                                        <tr key={post._id}>
                                            <td>
                                                <Image
                                                    src={post.imagenUrl || '/images/default-post.jpg'}
                                                    rounded
                                                    height={50}
                                                    width={75}
                                                    style={{ objectFit: 'cover' }}
                                                    alt={post.titulo}
                                                />
                                            </td>
                                            <td>{post.titulo}</td>
                                            <td>{post.autor}</td>
                                            <td>{post.likes}</td>
                                            <td>{post.comentarios?.length || 0}</td>
                                            {/* <td>{capitalizar(post.estado)}</td> */}
                                            <td>{post.publicado ? '✅' : '❌'}</td>
                                            <td>
                                                <Link to={`/admin/blogposts/edit/${post._id}`} className="btn general_btn mb-2 mb-md-0 me-2">Editar</Link>
                                                <Button variant="danger" onClick={() => deletePost(post._id)}>
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>

                        <div className="d-flex justify-content-center gap-2 mt-3">
                            <Button
                                variant="secondary"
                                onClick={() => handlePagina(paginaActual - 1)}
                                disabled={paginaActual === 1}
                            >
                                Anterior
                            </Button>

                            <span className="align-self-center">
                                Página {paginaActual} de {totalPaginas}
                            </span>

                            <Button
                                variant="secondary"
                                onClick={() => handlePagina(paginaActual + 1)}
                                disabled={paginaActual === totalPaginas}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
