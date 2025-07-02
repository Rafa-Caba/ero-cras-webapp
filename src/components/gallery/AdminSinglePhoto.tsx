import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import type { ImagenGaleria } from '../../types';
import { eliminarImagen, obtenerImagenPorId } from '../../services/gallery';

interface Props {
    photoId: string;
}

export const AdminSinglePhoto = ({ photoId }: Props) => {
    const navigate = useNavigate();
    const [imagen, setImagen] = useState<ImagenGaleria | null>(null);

    useEffect(() => {
        const cargarCanto = async () => {
            try {
                if (photoId) {
                    const data = await obtenerImagenPorId(photoId);
                    setImagen(data);
                }
            } catch (error) {
                console.error('Error al obtener la imagen:', error);
            }
        };

        cargarCanto();
    }, [photoId]);

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción no se puede deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed && imagen) {
            const { mensaje } = await eliminarImagen(photoId);
            await Swal.fire('Borrado', mensaje, 'success');
            navigate('/admin/gallery');
        }
    };

    if (!imagen) return <p className="text-center mt-5">Cargando imagen...</p>;

    return (
        <div className="d-flex flex-column px-3 align-items-center w-100">
            <div className="contenedor d-flex justify-content-center pt-3 mb-3">
                <h2 className="titulo">
                    Imagen: {imagen.titulo}
                </h2>
            </div>
            <div className="contenedor" style={{ minHeight: '65vh' }}>
                <div className="d-flex flex-column mb-3" style={{ minWidth: '30vw' }}>
                    <img
                        className="img-fluid"
                        src={imagen.imagenUrl}
                        alt={imagen.titulo}
                    />
                    <div className="imagen_options d-flex justify-content-center mt-3">
                        <Link
                            to={`/admin/edit_imagen/${imagen._id}`}
                            className="mt-3 me-3 btn general_btn">
                            Editar
                        </Link>
                        <Link
                            className="mt-3 me-3 btn general_btn"
                            onClick={() => navigate('/admin/gallery')}
                            to='/admin/gallery'
                        >
                            Regresar
                        </Link>
                        <Button
                            variant="danger"
                            className="mt-3 px-4"
                            onClick={handleDelete}
                        >
                            Borrar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
