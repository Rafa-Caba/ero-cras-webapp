import { useEffect, useState } from 'react';
import { Modal, Button, ProgressBar, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ExcelJS from 'exceljs';
import * as mammoth from 'mammoth';
import { obtenerIconoArchivo } from '../../utils/functionsFilesNames';

interface Props {
    type: 'image' | 'file' | 'audio' | 'video' | null;
    fileUrl: string | null;
    fileName?: string;
    onClose: () => void;
}

export const ChatFilePreviewModal = ({ type, fileUrl, fileName = '', onClose }: Props) => {
    const show = !!fileUrl;
    const [previewContent, setPreviewContent] = useState<string | string[][] | null>(null);
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDownload = async () => {
        if (!fileUrl) return;
        setProgress(10);

        try {
            const response = await fetch(fileUrl);
            setProgress(50);
            const blob = await response.blob();
            setProgress(80);

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            setProgress(100);
        } catch (error) {
            console.warn("Blob download failed (likely CORS), falling back to direct link", error);
            window.open(fileUrl, '_blank');
            setProgress(100);
        } finally {
            setTimeout(() => setProgress(0), 1000);
        }
    };

    useEffect(() => {
        const loadPreview = async () => {
            if (!fileUrl || !fileName || type !== 'file') return;

            const lower = fileName.toLowerCase();
            setPreviewContent(null);
            setFileContent('');
            setLoading(true);

            try {
                if (lower.endsWith('.pdf')) {
                    setPreviewContent(fileUrl);
                    setLoading(false);
                    return;
                }

                const res = await fetch(fileUrl);
                const blob = await res.blob();

                if (lower.endsWith('.txt') || lower.endsWith('.csv')) {
                    const text = await blob.text();
                    setPreviewContent(text);
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
                    try {
                        const arrayBuffer = await blob.arrayBuffer();
                        const result = await mammoth.convertToHtml({ arrayBuffer });

                        if (result.value.trim()) {
                            setFileContent(result.value);
                        } else {
                            throw new Error('Empty document');
                        }
                    } catch {
                        const fallbackUrl = `https://docs.google.com/gview?url=${fileUrl}&embedded=true`;
                        setPreviewContent(fallbackUrl);
                    }
                }
            } catch (error) {
                console.error('Error loading preview:', error);
                setPreviewContent('Error al cargar la vista previa.');
            } finally {
                setLoading(false);
            }
        };

        loadPreview();
    }, [fileUrl, fileName, type]);

    return (
        <Modal show={show} onHide={onClose} centered size="xl">
            <Modal.Header className='modal-chat-bg-color' closeButton>
                <Modal.Title>Vista del mensaje</Modal.Title>
            </Modal.Header>

            <Modal.Body className="text-center modal-chat-bg-color p-0">
                {progress > 0 && progress < 100 && <ProgressBar animated now={progress} className="m-3" />}

                {type === 'image' && fileUrl && (
                    <div className="p-3">
                        <img
                            src={fileUrl}
                            alt="Imagen del mensaje"
                            className="img-fluid rounded"
                            style={{ maxHeight: '80vh' }}
                        />
                    </div>
                )}

                {(type === 'audio' || type === 'video') && fileUrl && (
                    <div className="p-3">
                        {type === 'audio' ? (
                            <audio controls className="w-100">
                                <source src={fileUrl} />
                                Tu navegador no soporta audio.
                            </audio>
                        ) : (
                            <video controls className="w-100 rounded shadow-sm" style={{ maxHeight: '60vh' }}>
                                <source src={fileUrl} />
                                Tu navegador no soporta video.
                            </video>
                        )}
                        <p className="mt-2 small text-muted">{fileName}</p>
                    </div>
                )}

                {type === 'file' && fileUrl && (
                    <div className="d-flex flex-column align-items-center w-100 h-100">

                        {!fileName.toLowerCase().endsWith('.pdf') && (
                            <div className="p-3 border-bottom w-100 bg-light bg-opacity-10">
                                <FontAwesomeIcon icon={obtenerIconoArchivo(fileName)} size="3x" className="mb-2" />
                                <p className="fw-semibold m-0">{fileName}</p>
                            </div>
                        )}

                        {fileName.toLowerCase().endsWith('.docx') && (
                            <div className="text-start w-100 p-4 bg-white text-dark" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                                {loading ? (
                                    <div className='d-flex justify-content-center align-items-center my-2'>
                                        <Spinner animation="border" />
                                    </div>
                                ) : fileContent ? (
                                    <div dangerouslySetInnerHTML={{ __html: fileContent }} />
                                ) : typeof previewContent === 'string' ? (
                                    <iframe
                                        src={previewContent}
                                        style={{ width: '100%', height: '600px' }}
                                        frameBorder="0"
                                        title="Docx Preview"
                                    ></iframe>
                                ) : (
                                    <p className="text-muted">No se pudo mostrar el contenido.</p>
                                )}
                            </div>
                        )}

                        {!loading && fileName.toLowerCase().endsWith('.pdf') && typeof previewContent === 'string' && (
                            <div className="w-100" style={{ height: '75vh' }}>
                                <object
                                    data={previewContent}
                                    type="application/pdf"
                                    width="100%"
                                    height="100%"
                                    className="rounded-bottom"
                                >
                                    <div className="d-flex flex-column align-items-center justify-content-center h-100 bg-light">
                                        <p>Tu navegador no puede mostrar este PDF directamente.</p>
                                        <Button onClick={handleDownload}>Descargar PDF</Button>
                                    </div>
                                </object>
                            </div>
                        )}

                        {!loading && typeof previewContent === 'string' && (fileName.toLowerCase().endsWith('.txt') || fileName.toLowerCase().endsWith('.csv')) && (
                            <pre className="text-start small bg-light p-3 w-100 overflow-auto m-0" style={{ maxHeight: '60vh' }}>
                                {previewContent}
                            </pre>
                        )}

                        {!loading && Array.isArray(previewContent) && (
                            <div className="table-responsive w-100 p-0" style={{ maxHeight: '70vh' }}>
                                <table className="table table-striped table-bordered table-hover mb-0 text-nowrap">
                                    <tbody>
                                        {previewContent.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((cell, j) => (
                                                    <td key={j} style={{ minWidth: '100px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {loading && !fileName.toLowerCase().endsWith('.docx') && !fileName.toLowerCase().endsWith('.pdf') && (
                            <div className="p-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">Cargando vista previa...</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="justify-content-between modal-chat-bg-color">
                <Button variant="secondary" className='px-3' onClick={onClose}>
                    Cerrar
                </Button>
                {fileUrl && (
                    <Button onClick={handleDownload} className="btn general_btn">
                        Descargar
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};