import {
    faFilePdf, faFileWord, faFileExcel, faFileCsv, faFilePowerpoint, faFileZipper,
    faFileAudio, faFileVideo, faFileLines, type IconDefinition
} from '@fortawesome/free-solid-svg-icons';

export const obtenerIconoArchivo = (nombre: string): IconDefinition => {
    const ext = nombre.split('.').pop()?.toLowerCase();

    if (!ext) return faFileLines;

    if (ext === 'pdf') return faFilePdf;
    if (['doc', 'docx'].includes(ext)) return faFileWord;
    if (['xls', 'xlsx'].includes(ext)) return faFileExcel;
    if (ext === 'csv') return faFileCsv;
    if (['ppt', 'pptx'].includes(ext)) return faFilePowerpoint;
    if (['zip', 'rar'].includes(ext)) return faFileZipper;
    if (['mp3', 'wav'].includes(ext)) return faFileAudio;
    if (['mp4', 'mov', 'webm'].includes(ext)) return faFileVideo;

    return faFileLines;
};

interface ArchivoInfo {
    nombreBase: string; // sin extensión
    tipoMime: string;
}

export const extensionPorTipo: Record<string, string> = {
    // Archivos
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/csv': 'csv',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'text/plain': 'txt',
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',

    // Media
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/webm': 'webm',

    // Imágenes
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
};

export const generarNombreConExtension = ({ nombreBase, tipoMime }: ArchivoInfo): string => {
    const extension = extensionPorTipo[tipoMime] || 'bin';
    return `${nombreBase}.${extension}`;
};
