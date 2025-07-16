import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, Spinner } from 'react-bootstrap';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import { obtenerCantos } from '../../services/cantos';
import type { Canto } from '../../types';
import { useTiposCantoStore } from '../../store/admin/useTiposCantoStore';
import { parseTexto } from '../../utils/handleTextTipTap';

export const AdminCantosSection = () => {
    const [cantos, setCantos] = useState<Canto[]>([]);
    const [loading, setLoading] = useState(true);

    const { tipos, getTipos } = useTiposCantoStore();

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                await getTipos(); // obtiene los tipos dinámicos
                const data = await obtenerCantos();
                setCantos(data);
            } catch (error) {
                console.error('Error al cargar los cantos:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const tiposOrdenados = [...tipos].sort((a, b) => a.orden - b.orden);

    const cantosConTipo = tiposOrdenados.map(tipo => ({
        tipo: tipo.nombre,
        cantos: cantos.filter(c => c.tipo === tipo.nombre)
    }));

    const tiposExistentes = tipos.map(t => t.nombre);
    const cantosSinTipo = cantos.filter(c => !tiposExistentes.includes(c.tipo));

    return (
        <div className="d-flex flex-column justify-content-center px-3 px-md-5 mb-0">
            <div className="d-flex flex-column align-items-center w-100 my-2">
                <p className="fw-bold m-0 fs-1">Cantos</p>
                <div className="botones mb-1">
                    <Link to="/admin" className="btn general_btn px-3 m-2">Inicio</Link>
                    <Link to="/admin/cantos/new_song" className="btn general_btn me-2">Nuevo Canto</Link>
                </div>
            </div>

            <div className="cantos-contenedor pe-0 mb-2">
                {!loading
                    ? (
                        <Accordion alwaysOpen className='accordion-custom' id="accordionCantos">
                            {cantosConTipo.map((grupo, index) => (
                                <Accordion.Item eventKey={index.toString()} key={grupo.tipo}>
                                    <Accordion.Header>{grupo.tipo}</Accordion.Header>
                                    <Accordion.Body>
                                        {grupo.cantos.map((canto) => (
                                            <Accordion key={canto._id} className="accordion-custom mb-2">
                                                <Accordion.Item eventKey={String(canto._id)}>
                                                    <Accordion.Header>{canto.titulo}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <div>
                                                            <p>
                                                                <Link
                                                                    className="fw-bolder fs-4 text-decoration-none text-theme-color"
                                                                    to={`/admin/canto/${canto._id}`}
                                                                >
                                                                    - {canto.titulo} -
                                                                </Link>
                                                            </p>
                                                            <TiptapViewer content={parseTexto(canto.texto)} />
                                                        </div>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))}
                                    </Accordion.Body>
                                </Accordion.Item>
                            ))}

                            {cantosSinTipo.length > 0 && (
                                <Accordion.Item eventKey="sin-tipo">
                                    <Accordion.Header>Sin tipo de Canto</Accordion.Header>
                                    <Accordion.Body>
                                        {cantosSinTipo.map((canto) => (
                                            <Accordion key={canto._id} className="mb-2">
                                                <Accordion.Item eventKey={String(canto._id)}>
                                                    <Accordion.Header>{canto.titulo}</Accordion.Header>
                                                    <Accordion.Body>
                                                        <div>
                                                            <p>
                                                                <Link
                                                                    className="canto-single-link fw-bolder fs-4 text-decoration-none"
                                                                    to={`/admin/canto/${canto._id}`}
                                                                >
                                                                    - {canto.titulo} -
                                                                </Link>
                                                            </p>
                                                            <TiptapViewer content={parseTexto(canto.texto)} />
                                                        </div>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        ))}
                                    </Accordion.Body>
                                </Accordion.Item>
                            )}
                        </Accordion>
                    ) : (
                        <div className="cantos-contenedor text-center mt-3">
                            <Spinner animation="border" role="status" />
                        </div>
                    )
                }
            </div>
        </div>
    );
};
