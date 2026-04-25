// src/components/chat/XlsxPreview.tsx

import { useEffect, useState } from 'react';
import ExcelJS from 'exceljs';

import {
    Box,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@mui/material';

interface Props {
    url: string;
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

export const XlsxPreview = ({ url }: Props) => {
    const [data, setData] = useState<string[][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAndParseXlsx = async () => {
            try {
                setLoading(true);

                const response = await fetch(url);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();

                const workbook = new ExcelJS.Workbook();

                await workbook.xlsx.load(arrayBuffer);

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

                setData(rows);
            } catch (errorItem) {
                console.error(errorItem);
                setError('No se pudo cargar el archivo Excel.');
            } finally {
                setLoading(false);
            }
        };

        void fetchAndParseXlsx();
    }, [url]);

    if (loading) {
        return (
            <Box
                sx={{
                    py: 4,
                    display: 'grid',
                    placeItems: 'center',
                    gap: 1,
                    color: 'var(--color-text)',
                }}
            >
                <CircularProgress />
                <Typography sx={{ fontWeight: 800 }}>
                    Cargando archivo Excel...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Typography
                sx={{
                    color: '#dc2626',
                    textAlign: 'center',
                    fontWeight: 900,
                    py: 3,
                }}
            >
                {error}
            </Typography>
        );
    }

    if (data.length === 0) {
        return (
            <Typography
                sx={{
                    color: 'var(--color-secondary-text)',
                    textAlign: 'center',
                    fontWeight: 800,
                    py: 3,
                }}
            >
                El archivo está vacío.
            </Typography>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                borderRadius: 1.5,
                overflow: 'hidden',
                border: '1px solid color-mix(in srgb, var(--color-border) 36%, transparent)',
            }}
        >
            <TableContainer
                sx={{
                    maxHeight: 520,
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
                        {data.map((row, rowIndex) => (
                            <TableRow key={`xlsx-row-${rowIndex}`}>
                                {row.map((cell, cellIndex) => (
                                    <TableCell
                                        key={`xlsx-cell-${rowIndex}-${cellIndex}`}
                                        sx={{
                                            color: 'var(--color-text)',
                                            borderColor:
                                                'color-mix(in srgb, var(--color-border) 30%, transparent)',
                                            minWidth: 100,
                                            maxWidth: 300,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
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
        </Paper>
    );
};