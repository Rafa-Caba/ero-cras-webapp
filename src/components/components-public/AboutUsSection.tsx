import { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { FaImage } from 'react-icons/fa';
import { useGalleryStore } from '../../store/public/useGalleryStore';
import { useSettingsStore } from '../../store/public/useSettingsStore';
import { TiptapViewer } from '../tiptap-components/TiptapViewer';
import { parseText } from '../../utils/handleTextTipTap';

export const AboutUsSection = () => {
    const { settings, fetchSettings } = useSettingsStore();
    const { images } = useGalleryStore();

    const usImage = images.find(img => img.imageUs);

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <section className="center col-12 d-flex flex-column align-items-center order-0 order-md-1">
            <div className="nosotros primary-color-container my-3 mx-0 mx-md-2">
                <div className="nosotros p-1 mb-5">
                    <p className="fs-3 fw-bolder">Historia...</p>

                    <TiptapViewer content={parseText(settings?.history)} />
                </div>

                <div className={`${!usImage && 'imagen-nosotros-container'} text-center my-3 mt-auto fade-in`}>
                    {usImage ? (
                        <Image
                            src={usImage.imageUrl}
                            alt={usImage.title}
                            height={380}
                            width={650}
                            className="imagen-fija-inicio"
                        />
                    ) : (
                        <div className="text-muted d-flex flex-column align-items-center">
                            <FaImage size={100} color="#ccc" />
                            <p className="mt-2">No hay imagen de inicio aún</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};