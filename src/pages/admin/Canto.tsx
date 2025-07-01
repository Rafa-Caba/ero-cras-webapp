import { useParams } from 'react-router-dom';

import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft"
import AdminSidebarRight from "../../components-admin/AdminSidebarRight"
import AdminSingleCanto from "../../components/cantos/AdminSingleCanto";

const Canto = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <main className="page-main row d-flex w-100 m-0 p-0 flex-grow-1">
            <AdminSidebarLeft />
            <AdminSingleCanto cantoId={id ? id : ''} />
            <AdminSidebarRight />
        </main>
    )
}

export default Canto