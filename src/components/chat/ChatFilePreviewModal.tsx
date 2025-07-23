import { useEffect, useState } from 'react';
import { Modal, Button, ProgressBar, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ExcelJS from 'exceljs';
import * as mammoth from 'mammoth';
import { obtenerIconoArchivo } from '../../utils/functionsFilesNames';

interface Props {
    tipo: 'imagen' | 'archivo' | 'media' | null;
    archivoUrl: string | null;
    archivoNombre?: string;
    onClose: () => void;
}

export const ChatFilePreviewModal = ({ tipo, archivoUrl, archivoNombre = '', onClose }: Props) => {
    const show = !!archivoUrl;
    const [previewContent, setPreviewContent] = useState<string | string[][] | null>(null);
    const [contenidoArchivo, setContenidoArchivo] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDescargar = async () => {
        if (!archivoUrl) return;

        setProgress(10);
        const response = await fetch(archivoUrl);
        setProgress(50);
        const blob = await response.blob();
        setProgress(80);

        const enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(blob);
        enlace.download = archivoNombre;
        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
        setProgress(100);
        setTimeout(() => setProgress(0), 1000);
    };

    useEffect(() => {
        const cargarVistaPrevia = async () => {
            if (!archivoUrl || !archivoNombre || tipo !== 'archivo') return;

            const lower = archivoNombre.toLowerCase();

            // Limpiar estados al cambiar de archivo
            setPreviewContent(null);
            setContenidoArchivo('');
            setLoading(true);

            try {
                const res = await fetch(archivoUrl);
                const blob = await res.blob();

                if (lower.endsWith('.txt') || lower.endsWith('.csv')) {
                    const text = await blob.text();
                    setPreviewContent(text);
                } else if (lower.endsWith('.pdf')) {
                    setPreviewContent(`https://docs.google.com/gview?url=${archivoUrl}&embedded=true`);

                } else if (lower.endsWith('.xlsx')) {
                    const buffer = await blob.arrayBuffer();
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(buffer);
                    const worksheet = workbook.worksheets[0];
                    const rows: string[][] = [];

                    worksheet.eachRow((row) => {
                        const rowData = (row.values as ExcelJS.CellValue[])
                            .slice(1)
                            .map((cell) =>
                                typeof cell === 'object' && cell !== null
                                    ? (cell as any).text || ''
                                    : String(cell || '')
                            );
                        rows.push(rowData);
                    });

                    setPreviewContent(rows);
                } else if (lower.endsWith('.docx')) {
                    // const arrayBuffer = await blob.arrayBuffer();
                    // const result = await mammoth.convertToHtml({ arrayBuffer });
                    // setContenidoArchivo(result.value);

                    try {
                        const arrayBuffer = await blob.arrayBuffer();
                        const result = await mammoth.convertToHtml({ arrayBuffer });

                        if (result.value.trim()) {
                            setContenidoArchivo(result.value);
                        } else {
                            throw new Error('Documento vacío o no procesable por Mammoth');
                        }
                    } catch {
                        const fallbackUrl = `https://docs.google.com/gview?url=${archivoUrl}&embedded=true`;
                        setPreviewContent(fallbackUrl); // usamos gview como respaldo
                    }
                }
            } catch (error) {
                console.error('Error cargando vista previa:', error);
                setPreviewContent('Error al cargar la vista previa.');
            } finally {
                setLoading(false);
            }
        };

        cargarVistaPrevia();
    }, [archivoUrl, archivoNombre, tipo]);

    useEffect(() => {
        return () => {
            if (typeof previewContent === 'string' && previewContent.startsWith('blob:')) {
                URL.revokeObjectURL(previewContent);
            }
        };
    }, [previewContent]);

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header className='modal-chat-bg-color' closeButton>
                <Modal.Title>Vista del mensaje</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center modal-chat-bg-color">
                {progress > 0 && progress < 100 && <ProgressBar animated now={progress} className="mb-3" />}

                {/* VISTA IMAGEN */}
                {tipo === 'imagen' && archivoUrl && (
                    <img
                        src={archivoUrl}
                        alt="Imagen del mensaje"
                        className="img-fluid rounded"
                        style={{ maxHeight: '80vh' }}
                    />
                )}

                {/* VISTA MEDIA (audio/video) */}
                {tipo === 'media' && archivoUrl && (
                    <>
                        {archivoUrl.endsWith('.mp3') || archivoUrl.endsWith('.wav') ? (
                            <audio controls className="w-100">
                                <source src={archivoUrl} />
                                Tu navegador no soporta audio.
                            </audio>
                        ) : (
                            <video controls className="w-100 rounded shadow-sm" style={{ maxHeight: '60vh' }}>
                                <source src={archivoUrl} />
                                Tu navegador no soporta video.
                            </video>
                        )}
                        <p className="mt-2 small text-muted">{archivoNombre}</p>
                    </>
                )}

                {/* VISTA ARCHIVO */}
                {tipo === 'archivo' && archivoUrl && (
                    <div className="d-flex flex-column align-items-center gap-2 w-100">
                        <FontAwesomeIcon icon={obtenerIconoArchivo(archivoNombre)} size="4x" />
                        <p className="fw-semibold">{archivoNombre}</p>

                        {/* DOCX */}
                        {archivoNombre.endsWith('.docx') && (
                            <div className="text-start w-100" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                                {loading ? (
                                    <div className='d-flex justify-content-center align-items-center my-2'>
                                        <Spinner animation="border" />
                                    </div>
                                ) : contenidoArchivo ? (
                                    <div dangerouslySetInnerHTML={{ __html: contenidoArchivo }} />
                                ) : typeof previewContent === 'string' ? (
                                    <iframe
                                        src={previewContent}
                                        style={{ width: '100%', height: '500px' }}
                                        frameBorder="0"
                                    ></iframe>
                                ) : (
                                    <p className="text-muted">No se pudo mostrar el contenido del archivo.</p>
                                )}
                            </div>
                            // <div className="text-start w-100" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            //     {contenidoArchivo ? (
                            //         <div dangerouslySetInnerHTML={{ __html: contenidoArchivo }} />
                            //     ) : (
                            //         <p className="text-muted">No se pudo mostrar el contenido del archivo.</p>
                            //     )}
                            // </div>
                        )}

                        {/* PDF */}
                        {!loading && archivoNombre.endsWith('.pdf') && typeof previewContent === 'string' && (
                            <iframe
                                src={previewContent}
                                style={{ width: '100%', height: '500px' }}
                                frameBorder="0"
                            ></iframe>
                        )}

                        {/* TXT o CSV */}
                        {!loading && typeof previewContent === 'string' && !archivoNombre.endsWith('.docx') && (
                            <pre className="text-start small bg-light p-2 rounded w-100 overflow-auto" style={{ maxHeight: '40vh' }}>
                                {previewContent}
                            </pre>
                        )}

                        {/* XLSX */}
                        {!loading && Array.isArray(previewContent) && (
                            <table className="table table-sm table-bordered w-100 small">
                                <tbody>
                                    {previewContent.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {loading && !archivoNombre.endsWith('.docx') && (
                            <p className="text-muted">Cargando vista previa...</p>
                        )}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="justify-content-between modal-chat-bg-color">
                <Button variant="secondary" onClick={onClose}>
                    Cerrar
                </Button>
                {archivoUrl && archivoNombre && (
                    <Button onClick={handleDescargar} className="btn btn-primary">
                        Descargar
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};
