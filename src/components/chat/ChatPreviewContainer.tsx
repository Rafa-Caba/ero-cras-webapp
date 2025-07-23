import { Button, Figure, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { obtenerIconoArchivo } from '../../utils/functionsFilesNames';

interface Props {
    previewTipo: 'imagen' | 'archivo' | 'media' | null;
    previewUrl: string | null;
    previewNombre?: string;
    cargando: boolean;
    onPreviewClick: (tipo: 'imagen' | 'archivo' | 'media', url: string, nombre?: string) => void;
    onImagenClick: (url: string) => void;
}

export const ChatPreviewContainer = ({
    previewTipo,
    previewUrl,
    previewNombre,
    cargando,
    onPreviewClick,
    onImagenClick,
}: Props) => {
    if (!previewTipo || !previewUrl) return null;

    if (previewTipo === 'imagen') {
        return (
            <Button variant="link" className="m-0 p-0 text-start" onClick={() => onImagenClick(previewUrl)}>
                <Figure className="mb-0">
                    <Figure.Caption className="mb-1">Imagen seleccionada:</Figure.Caption>
                    <Figure.Image width={80} alt="preview" src={previewUrl} className="rounded shadow-sm" />
                </Figure>
            </Button>
        );
    }

    const icon = obtenerIconoArchivo(previewNombre || '');

    const caption = previewTipo === 'archivo' ? 'Ver archivo' : 'Reproducir';
    const captionClass = previewTipo === 'archivo' ? 'btn-outline-morado' : 'btn-outline-success';

    return (
        <>
            <Button
                variant="link"
                className="p-0 border-0"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onPreviewClick(previewTipo, previewUrl, previewNombre);
                }}
            >
                <div className="archivo-msg d-flex flex-column align-items-start gap-1 mb-2">
                    <p className="mb-1 fw-semibold text-dark d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={icon} size="lg" />
                        {previewNombre}
                    </p>
                    <span className={`btn ${captionClass} btn-sm rounded-pill`}>{caption}</span>
                </div>
            </Button>

            {cargando && (
                <div className="text-center my-2">
                    <Spinner animation="border" />
                </div>
            )}
        </>
    );
};
