import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft"
import AdminSidebarRight from "../../components-admin/AdminSidebarRight"
import { AdminEditPhoto } from "../../components/gallery/AdminEditPhoto"


export const EditPhoto = () => {

    return (
        <main className="page-main row d-flex w-100 m-0 p-0 flex-grow-1">
            <AdminSidebarLeft />
            <AdminEditPhoto />
            <AdminSidebarRight />
        </main>
    )
}