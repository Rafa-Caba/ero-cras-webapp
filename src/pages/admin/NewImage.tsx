import { AdminNewPhoto } from "../../components/gallery/AdminNewPhoto"
import AdminSidebarLeft from "../../components-admin/AdminSidebarLeft"
import AdminSidebarRight from "../../components-admin/AdminSidebarRight"


export const NewImage = () => {
    return (
        <main className="page-main row d-flex w-100 m-0 p-0 flex-grow-1">
            <AdminSidebarLeft />
            <AdminNewPhoto />
            <AdminSidebarRight />
        </main>
    )
}
