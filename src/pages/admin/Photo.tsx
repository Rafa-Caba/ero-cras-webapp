import { useParams } from 'react-router-dom';
import { AdminSinglePhoto } from '../../components/gallery/AdminSinglePhoto';

export const Photo = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <AdminSinglePhoto photoId={id!} />
    );
}

