// components/chat/file-previews/XlsxPreview.tsx
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import ExcelJS from 'exceljs';

interface Props {
    url: string;
}

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
                    const valores = row.values;

                    if (!Array.isArray(valores)) return;

                    const rowData = valores
                        .slice(1) // Saltamos el índice 0 que usualmente está vacío
                        .map((cell) =>
                            typeof cell === 'object' && cell !== null
                                ? (cell as any).text || ''
                                : String(cell ?? '')
                        );

                    rows.push(rowData);
                });

                setData(rows);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar el archivo Excel.');
            } finally {
                setLoading(false);
            }
        };

        fetchAndParseXlsx();
    }, [url]);

    if (loading) return <p className="text-center">Cargando archivo Excel...</p>;
    if (error) return <p className="text-danger text-center">{error}</p>;
    if (data.length === 0) return <p className="text-muted text-center">El archivo está vacío.</p>;

    return (
        <div className="table-responsive">
            <Table striped bordered hover size="sm">
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex}>{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
