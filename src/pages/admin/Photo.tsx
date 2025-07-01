import { useParams } from 'react-router-dom';
import AdminSidebarLeft from '../../components-admin/AdminSidebarLeft';
import AdminSidebarRight from '../../components-admin/AdminSidebarRight';
import { AdminSinglePhoto } from '../../components/gallery/AdminSinglePhoto';

export const Photo = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <main className="page-main row d-flex w-100 m-0 p-0 flex-grow-1">
            <AdminSidebarLeft />
            <AdminSinglePhoto photoId={id!} />
            <AdminSidebarRight />
        </main>
    )
}

