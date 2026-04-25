// src/components/chat/ChatFilePreviewModal.tsx

import { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';
import * as mammoth from 'mammoth';

import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { obtenerIconoArchivo } from '../../utils/functionsFilesNames';

interface Props {
    type: 'image' | 'file' | 'audio' | 'video' | null;
    fileUrl: string | null;
    fileName?: string;
    onClose: () => void;
}

interface ExcelCellObject {
    text?: string;
}

const getExcelCellText = (cell: ExcelJS.CellValue): string => {
    if (cell === null || cell === undefined) {
        return '';
    }

    if (typeof cell === 'object') {
        const possibleText = (cell as ExcelCellObject).text;

        if (typeof possibleText === 'string') {
            return possibleText;
        }

        return String(cell);
    }

    return String(cell);
};

export const ChatFilePreviewModal = ({
    type,
    fileUrl,
    fileName = '',
    onClose,
}: Props) => {
    const show = Boolean(fileUrl);

    const [previewContent, setPreviewContent] = useState<string | string[][] | null>(null);
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const lowerFileName = fileName.toLowerCase();

    const handleDownload = async () => {
        if (!fileUrl) {
            return;
        }

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
            console.warn('Blob download failed, falling back to direct link', error);
            window.open(fileUrl, '_blank');
            setProgress(100);
        } finally {
            window.setTimeout(() => setProgress(0), 1000);
        }
    };

    useEffect(() => {
        const loadPreview = async () => {
            if (!fileUrl || !fileName || type !== 'file') {
                return;
            }

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

                const response = await fetch(fileUrl);
                const blob = await response.blob();

                if (lower.endsWith('.txt') || lower.endsWith('.csv')) {
                    const text = await blob.text();
                    setPreviewContent(text);
                    return;
                }

                if (lower.endsWith('.xlsx')) {
                    const buffer = await blob.arrayBuffer();
                    const workbook = new ExcelJS.Workbook();

                    await workbook.xlsx.load(buffer);

                    const worksheet = workbook.worksheets[0];
                    const rows: string[][] = [];

                    worksheet.eachRow((row) => {
                        const values = row.values;

                        if (!Array.isArray(values)) {
                            return;
                        }

                        const rowData = values
                            .slice(1)
                            .map((cell) => getExcelCellText(cell as ExcelJS.CellValue));

                        rows.push(rowData);
                    });

                    setPreviewContent(rows);
                    return;
                }

                if (lower.endsWith('.docx')) {
                    try {
                        const arrayBuffer = await blob.arrayBuffer();
                        const result = await mammoth.convertToHtml({ arrayBuffer });

                        if (result.value.trim()) {
                            setFileContent(result.value);
                            return;
                        }

                        throw new Error('Empty document');
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

        void loadPreview();
    }, [fileUrl, fileName, type]);

    return (
        <Dialog
            open={show}
            onClose={onClose}
            fullWidth
            maxWidth="xl"
            scroll="paper"
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: 2,
                        backgroundColor: 'var(--color-card)',
                        color: 'var(--color-text)',
                        border: '1px solid color-mix(in srgb, var(--color-border) 46%, transparent)',
                        boxShadow: '0 22px 70px rgba(15, 23, 42, 0.22)',
                        overflow: 'hidden',
                    },
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    fontWeight: 950,
                    borderBottom: '1px solid color-mix(in srgb, var(--color-border) 36%, transparent)',
                }}
            >
                <Box
                    component="span"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        minWidth: 0,
                    }}
                >
                    <InsertDriveFileRoundedIcon sx={{ color: 'var(--color-primary)' }} />
                    <Box
                        component="span"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Vista del mensaje
                    </Box>
                </Box>

                <IconButton
                    aria-label="Cerrar vista previa"
                    onClick={onClose}
                    sx={{ color: 'var(--color-text)' }}
                >
                    <CloseRoundedIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 0,
                    backgroundColor: 'var(--color-card)',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                }}
            >
                {progress > 0 && progress < 100 && (
                    <Box sx={{ p: 2 }}>
                        <LinearProgress variant="determinate" value={progress} />
                    </Box>
                )}

                {type === 'image' && fileUrl && (
                    <Box
                        sx={{
                            p: 2,
                            display: 'grid',
                            placeItems: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src={fileUrl}
                            alt="Imagen del mensaje"
                            sx={{
                                maxWidth: '100%',
                                maxHeight: '80vh',
                                borderRadius: 2,
                                objectFit: 'contain',
                                display: 'block',
                            }}
                        />
                    </Box>
                )}

                {(type === 'audio' || type === 'video') && fileUrl && (
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1.25,
                        }}
                    >
                        {type === 'audio' ? (
                            <Box
                                component="audio"
                                controls
                                sx={{
                                    width: '100%',
                                    maxWidth: 900,
                                }}
                            >
                                <source src={fileUrl} />
                                Tu navegador no soporta audio.
                            </Box>
                        ) : (
                            <Box
                                component="video"
                                controls
                                sx={{
                                    width: '100%',
                                    maxHeight: '60vh',
                                    borderRadius: 2,
                                    boxShadow: '0 14px 36px rgba(15, 23, 42, 0.18)',
                                }}
                            >
                                <source src={fileUrl} />
                                Tu navegador no soporta video.
                            </Box>
                        )}

                        <Typography
                            sx={{
                                color: 'var(--color-secondary-text)',
                                fontWeight: 800,
                                fontSize: '0.86rem',
                                overflowWrap: 'anywhere',
                            }}
                        >
                            {fileName}
                        </Typography>
                    </Box>
                )}

                {type === 'file' && fileUrl && (
                    <Box
                        sx={{
                            width: '100%',
                            minHeight: 320,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {!lowerFileName.endsWith('.pdf') && (
                            <Paper
                                elevation={0}
                                sx={{
                                    width: '100%',
                                    p: 2,
                                    borderRadius: 0,
                                    textAlign: 'center',
                                    backgroundColor:
                                        'color-mix(in srgb, var(--color-card) 84%, var(--color-primary) 16%)',
                                    color: 'var(--color-text)',
                                    borderBottom:
                                        '1px solid color-mix(in srgb, var(--color-border) 36%, transparent)',
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={obtenerIconoArchivo(fileName)}
                                    size="3x"
                                    style={{ marginBottom: 8 }}
                                />

                                <Typography
                                    sx={{
                                        fontWeight: 950,
                                        overflowWrap: 'anywhere',
                                    }}
                                >
                                    {fileName}
                                </Typography>
                            </Paper>
                        )}

                        {lowerFileName.endsWith('.docx') && (
                            <Box
                                sx={{
                                    width: '100%',
                                    p: 2,
                                    maxHeight: '65vh',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    backgroundColor: '#ffffff',
                                    color: '#111827',
                                    textAlign: 'left',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    '&::-webkit-scrollbar': {
                                        display: 'none',
                                    },
                                }}
                            >
                                {loading ? (
                                    <Box
                                        sx={{
                                            py: 4,
                                            display: 'grid',
                                            placeItems: 'center',
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                ) : fileContent ? (
                                    <Box dangerouslySetInnerHTML={{ __html: fileContent }} />
                                ) : typeof previewContent === 'string' ? (
                                    <Box
                                        component="iframe"
                                        src={previewContent}
                                        title="Vista previa DOCX"
                                        sx={{
                                            width: '100%',
                                            height: 600,
                                            border: 0,
                                        }}
                                    />
                                ) : (
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        No se pudo mostrar el contenido.
                                    </Typography>
                                )}
                            </Box>
                        )}

                        {!loading &&
                            lowerFileName.endsWith('.pdf') &&
                            typeof previewContent === 'string' && (
                                <Box sx={{ width: '100%', height: '75vh' }}>
                                    <Box
                                        component="object"
                                        data={previewContent}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                    >
                                        <Box
                                            sx={{
                                                height: '100%',
                                                display: 'grid',
                                                placeItems: 'center',
                                                backgroundColor:
                                                    'color-mix(in srgb, var(--color-card) 86%, var(--color-primary) 14%)',
                                                p: 2,
                                                textAlign: 'center',
                                            }}
                                        >
                                            <Typography sx={{ mb: 1, fontWeight: 800 }}>
                                                Tu navegador no puede mostrar este PDF directamente.
                                            </Typography>

                                            <Button variant="contained" onClick={handleDownload}>
                                                Descargar PDF
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                        {!loading &&
                            typeof previewContent === 'string' &&
                            (lowerFileName.endsWith('.txt') || lowerFileName.endsWith('.csv')) && (
                                <Box
                                    component="pre"
                                    sx={{
                                        width: '100%',
                                        maxHeight: '60vh',
                                        m: 0,
                                        p: 2,
                                        overflow: 'auto',
                                        textAlign: 'left',
                                        backgroundColor:
                                            'color-mix(in srgb, var(--color-card) 86%, var(--color-primary) 14%)',
                                        color: 'var(--color-text)',
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                        '&::-webkit-scrollbar': {
                                            display: 'none',
                                        },
                                    }}
                                >
                                    {previewContent}
                                </Box>
                            )}

                        {!loading && Array.isArray(previewContent) && (
                            <TableContainer
                                sx={{
                                    width: '100%',
                                    maxHeight: '70vh',
                                    overflow: 'auto',
                                    scrollbarWidth: 'none',
                                    msOverflowStyle: 'none',
                                    '&::-webkit-scrollbar': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <Table size="small" stickyHeader>
                                    <TableBody>
                                        {previewContent.map((row, rowIndex) => (
                                            <TableRow key={`row-${rowIndex}`}>
                                                {row.map((cell, cellIndex) => (
                                                    <TableCell
                                                        key={`cell-${rowIndex}-${cellIndex}`}
                                                        sx={{
                                                            minWidth: 100,
                                                            maxWidth: 300,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            color: 'var(--color-text)',
                                                            borderColor:
                                                                'color-mix(in srgb, var(--color-border) 30%, transparent)',
                                                        }}
                                                    >
                                                        {cell}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}

                        {loading &&
                            !lowerFileName.endsWith('.docx') &&
                            !lowerFileName.endsWith('.pdf') && (
                                <Box
                                    sx={{
                                        py: 5,
                                        display: 'grid',
                                        placeItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <CircularProgress />
                                    <Typography
                                        sx={{
                                            color: 'var(--color-secondary-text)',
                                            fontWeight: 800,
                                        }}
                                    >
                                        Cargando vista previa...
                                    </Typography>
                                </Box>
                            )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions
                sx={{
                    p: 1.5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 1,
                    borderTop: '1px solid color-mix(in srgb, var(--color-border) 36%, transparent)',
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        borderRadius: 1.5,
                        fontWeight: 950,
                    }}
                >
                    Cerrar
                </Button>

                {fileUrl && (
                    <Button
                        variant="contained"
                        startIcon={<DownloadRoundedIcon />}
                        onClick={handleDownload}
                        sx={{
                            borderRadius: 1.5,
                            fontWeight: 950,
                        }}
                    >
                        Descargar
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};