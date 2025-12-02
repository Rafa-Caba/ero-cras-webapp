import { Button, Figure, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { obtenerIconoArchivo } from '../../utils/functionsFilesNames';

interface Props {
    previewType: 'image' | 'file' | 'audio' | 'video' | null;
    previewUrl: string | null;
    previewName?: string;
    loading: boolean;
    onPreviewClick: (type: 'image' | 'file' | 'audio' | 'video', url: string, name?: string) => void;
    onImageClick: (url: string) => void;
}

export const ChatPreviewContainer = ({
    previewType,
    previewUrl,
    previewName,
    loading,
    onPreviewClick,
    onImageClick,
}: Props) => {
    if (!previewType || !previewUrl) return null;

    if (previewType === 'image') {
        return (
            <Button variant="link" className="m-0 p-0 text-start" onClick={() => onImageClick(previewUrl)}>
                <Figure className="mb-0">
                    <Figure.Caption className="mb-1">Imagen seleccionada:</Figure.Caption>
                    <Figure.Image width={80} alt="preview" src={previewUrl} className="rounded shadow-sm" />
                </Figure>
            </Button>
        );
    }

    const icon = obtenerIconoArchivo(previewName || '');

    const caption = previewType === 'file' ? 'Ver archivo' : 'Reproducir';
    const captionClass = previewType === 'file' ? 'btn-outline-morado' : 'btn-outline-success';

    return (
        <>
            <Button
                variant="link"
                className="p-0 border-0"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onPreviewClick(previewType, previewUrl, previewName);
                }}
            >
                <div className="archivo-msg d-flex flex-column align-items-start gap-1 mb-2">
                    <p className="mb-1 fw-semibold text-dark d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={icon} size="lg" />
                        {previewName}
                    </p>
                    <span className={`btn ${captionClass} btn-sm rounded-pill`}>{caption}</span>
                </div>
            </Button>

            {loading && (
                <div className="text-center my-2">
                    <Spinner animation="border" />
                </div>
            )}
        </>
    );
};