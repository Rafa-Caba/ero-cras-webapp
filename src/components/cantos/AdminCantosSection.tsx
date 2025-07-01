import { Accordion, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerCantos } from '../../services/cantos';
import type { Canto } from '../../types';

const tipoDeCantos = [
    'Entrada',
    'Kyrie',
    'Gloria',
    'Aleluya',
    'Presentacion de Dones',
    'Santo',
    'Cordero de Dios',
    'Comunion',
    'Salida',
];

const AdminCantosSection = () => {
    const [cantos, setCantos] = useState<Canto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarCantos = async () => {
            try {
                const data = await obtenerCantos();
                setCantos(data);
            } catch (error) {
                console.error('Error al cargar los cantos:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarCantos();
    }, []);

    // console.log({
    //     ...cantos
    // })

    if (loading) return <p>Cargando cantos...</p>;

    return (
        <section className="col-12 col-md-8 d-flex flex-column align-items-center order-0 order-md-1 my-3">
            <div style={{ minHeight: '75vh' }} className="galeria w-100 d-flex flex-column justify-content-center px-3 px-md-5 mb-0">
                <div className="d-flex flex-column align-items-center w-100 my-2">
                    <p className="fw-bold m-0 fs-1">Cantos Ero Cras</p>
                    <div className="botones mb-1">
                        <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link>
                        <Link to="/admin/cantos/new_song" className="btn general_btn me-2">Nuevo Canto</Link>
                    </div>
                </div>

                <div className="cantos-contenedor mb-2">
                    {
                        !loading
                            ? (
                                <Accordion alwaysOpen id="accordionCantos">
                                    {tipoDeCantos.map((tipo, index) => (
                                        <Accordion.Item eventKey={index.toString()} key={tipo}>
                                            <Accordion.Header>{tipo === 'Presentacion de Dones' ? 'Presentación de Dones' : tipo}</Accordion.Header>
                                            <Accordion.Body>
                                                {cantos
                                                    .filter((canto) => canto.tipo === tipo)
                                                    .map((canto) => (
                                                        <Accordion key={canto._id} className="mb-2">
                                                            <Accordion.Item eventKey={String(canto._id)}>
                                                                <Accordion.Header>{canto.titulo}</Accordion.Header>
                                                                <Accordion.Body>
                                                                    <div className=''>
                                                                        <p>
                                                                            <Link
                                                                                className="canto-single-link fw-bolder fs-4 text-decoration-none"
                                                                                to={`/admin/canto/${canto._id}`}
                                                                            >
                                                                                - {canto.titulo} -
                                                                            </Link>
                                                                        </p>
                                                                        <p className="text-start" style={{ whiteSpace: 'pre-wrap' }}>{canto.texto}</p>
                                                                    </div>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        </Accordion>
                                                    ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            ) : (
                                <Spinner animation="border" role="status" />
                            )
                    }
                </div>
            </div>
        </section>
    );
};

export default AdminCantosSection;
